const Contest = require("../models/Contest");
const Category = require("../models/Category");

const handleError = (res, error, message = "Server error") => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ success: false, message: error.message || message });
};

const getContests = async (req, res) => {
  try {
    const {
      platform,
      participated,
      startDate,
      endDate,
      sort = "date",
    } = req.query;
    let query = { user: req.user.id };

    if (platform) {
      query.platform = platform;
    }

    if (participated !== undefined) {
      query.participated = participated === "true";
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let sortDirection = -1;
    let sortField = "date";

    if (sort) {
      if (sort.startsWith("-")) {
        sortField = sort.substring(1);
        sortDirection = -1;
      } else {
        sortField = sort;
        sortDirection = 1;
      }
    }

    const sortOptions = { [sortField]: sortDirection };

    const contests = await Contest.find(query).sort(sortOptions);

    const stats = {
      total: contests.length,
      participated: contests.filter((c) => c.participated).length,
      platforms: {},
    };

    contests.forEach((contest) => {
      if (!stats.platforms[contest.platform]) {
        stats.platforms[contest.platform] = {
          total: 0,
          participated: 0,
        };
      }

      stats.platforms[contest.platform].total++;

      if (contest.participated) {
        stats.platforms[contest.platform].participated++;
      }
    });

    res.json({
      success: true,
      count: contests.length,
      stats,
      data: contests,
    });
  } catch (error) {
    handleError(res, error, "Error retrieving contests");
  }
};

const addContest = async (req, res) => {
  try {
    const {
      platform,
      name,
      date,
      participated,
      rank,
      solved,
      totalProblems,
      duration,
      notes,
    } = req.body;

    if (!platform || !name || !date) {
      return res.status(400).json({
        success: false,
        message: "Platform, name, and date are required",
      });
    }

    const contest = new Contest({
      user: req.user.id,
      platform,
      name: name.trim(),
      date,
      participated,
      rank: participated && rank ? parseInt(rank) : null,
      solved: participated && solved ? parseInt(solved) : null,
      totalProblems: totalProblems ? parseInt(totalProblems) : null,
      duration: duration ? parseInt(duration) : null,
      notes,
    });

    const savedContest = await contest.save();

    res.status(201).json({
      success: true,
      data: savedContest,
    });
  } catch (error) {
    handleError(res, error, "Error adding contest");
  }
};

const updateContest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      platform,
      name,
      date,
      participated,
      rank,
      solved,
      totalProblems,
      duration,
      notes,
    } = req.body;

    const contest = await Contest.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found or not authorized",
      });
    }

    if (platform) contest.platform = platform;
    if (name) contest.name = name.trim();
    if (date) contest.date = date;

    if (participated !== undefined) {
      contest.participated = participated;

      if (!participated) {
        contest.rank = null;
        contest.solved = null;
      }
    }

    if (participated && rank !== undefined) {
      contest.rank = rank ? parseInt(rank) : null;
    }

    if (participated && solved !== undefined) {
      contest.solved = solved ? parseInt(solved) : null;
    }

    if (totalProblems !== undefined) {
      contest.totalProblems = totalProblems ? parseInt(totalProblems) : null;
    }

    if (duration !== undefined) {
      contest.duration = duration ? parseInt(duration) : null;
    }

    if (notes !== undefined) {
      contest.notes = notes;
    }

    await contest.save();

    res.json({
      success: true,
      data: contest,
    });
  } catch (error) {
    handleError(res, error, "Error updating contest");
  }
};

const deleteContest = async (req, res) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found or not authorized",
      });
    }

    await contest.deleteOne();

    res.json({
      success: true,
      message: "Contest deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting contest");
  }
};

const getPlatforms = async (req, res) => {
  try {
    const usedPlatforms = await Contest.distinct("platform", {
      user: req.user.id,
    });

    const userPlatforms = await Category.find({
      user: req.user.id,
      type: "goals",
    });

    const allPlatforms = [
      ...new Set([...usedPlatforms, ...userPlatforms.map((p) => p.name)]),
    ];

    res.json({
      success: true,
      platforms: allPlatforms,
    });
  } catch (error) {
    handleError(res, error, "Error getting platforms");
  }
};

const getContestStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const contests = await Contest.find(query);

    if (contests.length === 0) {
      return res.json({
        success: true,
        stats: {
          total: 0,
          participated: 0,
          participation_rate: 0,
          platforms: {},
          best_rank: null,
          average_rank: null,
          average_solve_rate: null,
          recent_trend: [],
        },
      });
    }

    const participated = contests.filter((c) => c.participated);

    const platforms = contests.reduce((acc, contest) => {
      if (!acc[contest.platform]) {
        acc[contest.platform] = {
          total: 0,
          participated: 0,
          avg_rank: null,
          best_rank: null,
        };
      }

      acc[contest.platform].total++;

      if (contest.participated) {
        acc[contest.platform].participated++;

        if (contest.rank) {
          if (!acc[contest.platform].ranks) {
            acc[contest.platform].ranks = [];
          }
          acc[contest.platform].ranks.push(contest.rank);

          if (
            !acc[contest.platform].best_rank ||
            contest.rank < acc[contest.platform].best_rank
          ) {
            acc[contest.platform].best_rank = contest.rank;
          }
        }
      }

      return acc;
    }, {});

    Object.keys(platforms).forEach((platform) => {
      if (platforms[platform].ranks && platforms[platform].ranks.length > 0) {
        platforms[platform].avg_rank = Math.round(
          platforms[platform].ranks.reduce((sum, rank) => sum + rank, 0) /
            platforms[platform].ranks.length
        );
        delete platforms[platform].ranks;
      }
    });

    const rankedContests = participated.filter((c) => c.rank);
    const bestRank =
      rankedContests.length > 0
        ? Math.min(...rankedContests.map((c) => c.rank))
        : null;

    const averageRank =
      rankedContests.length > 0
        ? Math.round(
            rankedContests.reduce((sum, c) => sum + c.rank, 0) /
              rankedContests.length
          )
        : null;

    const contestsWithSolveRate = participated.filter(
      (c) => c.solved !== null && c.totalProblems !== null
    );
    const averageSolveRate =
      contestsWithSolveRate.length > 0
        ? contestsWithSolveRate.reduce(
            (sum, c) => sum + c.solved / c.totalProblems,
            0
          ) / contestsWithSolveRate.length
        : null;

    const recentContests = [...participated]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map((c) => ({
        name: c.name,
        platform: c.platform,
        date: c.date,
        rank: c.rank,
        solved: c.solved,
        totalProblems: c.totalProblems,
      }));

    const stats = {
      total: contests.length,
      participated: participated.length,
      participation_rate: (participated.length / contests.length) * 100,
      platforms,
      best_rank: bestRank,
      average_rank: averageRank,
      average_solve_rate: averageSolveRate,
      recent_trend: recentContests,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    handleError(res, error, "Error getting contest statistics");
  }
};

module.exports = {
  getContests,
  addContest,
  updateContest,
  deleteContest,
  getPlatforms,
  getContestStats,
};

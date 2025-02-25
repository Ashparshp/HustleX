// This file provides mock data and services to use when API endpoints are not working correctly

// Mock schedule templates
const mockTemplates = [
  {
    _id: "template1",
    name: "Standard Work Day",
    dayType: "Weekday",
    description: "A typical 9-5 work day schedule",
    isDefault: true,
    items: [
      {
        _id: "item1",
        title: "Morning Planning",
        description: "Review tasks and plan the day",
        startTime: "09:00",
        endTime: "09:30",
        category: "Work",
        priority: "High",
        notes: "",
      },
      {
        _id: "item2",
        title: "Focused Work Session",
        description: "Deep work with no interruptions",
        startTime: "09:30",
        endTime: "12:00",
        category: "Work",
        priority: "High",
        notes: "",
      },
      {
        _id: "item3",
        title: "Lunch Break",
        description: "",
        startTime: "12:00",
        endTime: "13:00",
        category: "Break",
        priority: "Medium",
        notes: "",
      },
      {
        _id: "item4",
        title: "Team Meeting",
        description: "Weekly status update",
        startTime: "13:00",
        endTime: "14:00",
        category: "Meeting",
        priority: "Medium",
        notes: "",
      },
      {
        _id: "item5",
        title: "Afternoon Work Session",
        description: "",
        startTime: "14:00",
        endTime: "17:00",
        category: "Work",
        priority: "Medium",
        notes: "",
      },
    ],
    totalHours: 8,
  },
  {
    _id: "template2",
    name: "Weekend Study Session",
    dayType: "Weekend",
    description: "Focused learning time",
    isDefault: false,
    items: [
      {
        _id: "item6",
        title: "Reading Session",
        description: "Technical books and articles",
        startTime: "10:00",
        endTime: "12:00",
        category: "Study",
        priority: "High",
        notes: "",
      },
      {
        _id: "item7",
        title: "Lunch Break",
        description: "",
        startTime: "12:00",
        endTime: "13:00",
        category: "Break",
        priority: "Low",
        notes: "",
      },
      {
        _id: "item8",
        title: "Coding Practice",
        description: "Work on personal project",
        startTime: "13:00",
        endTime: "16:00",
        category: "Coding",
        priority: "High",
        notes: "",
      },
    ],
    totalHours: 5,
  },
];

// Mock schedules
const mockSchedules = [
  {
    _id: "schedule1",
    date: new Date(2025, 1, 25), // February 25, 2025
    dayType: "Weekday",
    status: "Completed",
    items: [
      {
        _id: "sitem1",
        title: "Team Standup",
        description: "Daily scrum meeting",
        startTime: "09:00",
        endTime: "09:15",
        category: "Meeting",
        priority: "Medium",
        completed: true,
        notes: "",
      },
      {
        _id: "sitem2",
        title: "Code Review",
        description: "Review pull requests",
        startTime: "09:30",
        endTime: "11:00",
        category: "Code Review",
        priority: "High",
        completed: true,
        notes: "",
      },
      {
        _id: "sitem3",
        title: "Lunch",
        description: "",
        startTime: "12:00",
        endTime: "13:00",
        category: "Break",
        priority: "Low",
        completed: true,
        notes: "",
      },
    ],
    totalHours: 3.75,
    overallCompletion: 100,
  },
  {
    _id: "schedule2",
    date: new Date(2025, 1, 26), // February 26, 2025 (today)
    dayType: "Weekday",
    status: "In Progress",
    items: [
      {
        _id: "sitem4",
        title: "Project Planning",
        description: "Plan next sprint",
        startTime: "09:00",
        endTime: "10:30",
        category: "Planning",
        priority: "High",
        completed: true,
        notes: "",
      },
      {
        _id: "sitem5",
        title: "Development",
        description: "Implement new features",
        startTime: "10:30",
        endTime: "12:30",
        category: "Coding",
        priority: "High",
        completed: true,
        notes: "",
      },
      {
        _id: "sitem6",
        title: "Lunch Break",
        description: "",
        startTime: "12:30",
        endTime: "13:30",
        category: "Break",
        priority: "Medium",
        completed: true,
        notes: "",
      },
      {
        _id: "sitem7",
        title: "Client Meeting",
        description: "Demo new features",
        startTime: "14:00",
        endTime: "15:00",
        category: "Meeting",
        priority: "High",
        completed: false,
        notes: "",
      },
      {
        _id: "sitem8",
        title: "Documentation",
        description: "Update API docs",
        startTime: "15:30",
        endTime: "17:00",
        category: "Documentation",
        priority: "Medium",
        completed: false,
        notes: "",
      },
    ],
    totalHours: 7.5,
    overallCompletion: 60,
  },
];

// Mock categories
const mockCategories = [
  {
    _id: "cat1",
    name: "Work",
    color: "#4a6da7",
    icon: "briefcase",
    type: "schedule",
  },
  {
    _id: "cat2",
    name: "Meeting",
    color: "#2980b9",
    icon: "users",
    type: "schedule",
  },
  {
    _id: "cat3",
    name: "Break",
    color: "#7f8c8d",
    icon: "coffee",
    type: "schedule",
  },
  {
    _id: "cat4",
    name: "Coding",
    color: "#d35400",
    icon: "code",
    type: "schedule",
  },
  {
    _id: "cat5",
    name: "Study",
    color: "#8e44ad",
    icon: "book",
    type: "schedule",
  },
  {
    _id: "cat6",
    name: "Planning",
    color: "#16a085",
    icon: "calendar",
    type: "schedule",
  },
  {
    _id: "cat7",
    name: "Code Review",
    color: "#27ae60",
    icon: "search",
    type: "schedule",
  },
  {
    _id: "cat8",
    name: "Documentation",
    color: "#3498db",
    icon: "file-text",
    type: "schedule",
  },
];

// Mock stats
const mockStats = {
  total: 2,
  totalHours: 11.25,
  planned: 0,
  inProgress: 1,
  completed: 1,
  averageCompletion: 80,
  categories: {
    Meeting: {
      totalItems: 2,
      completedItems: 1,
      totalHours: 1.25,
      completionRate: 50,
    },
    "Code Review": {
      totalItems: 1,
      completedItems: 1,
      totalHours: 1.5,
      completionRate: 100,
    },
    Break: {
      totalItems: 2,
      completedItems: 2,
      totalHours: 2,
      completionRate: 100,
    },
    Planning: {
      totalItems: 1,
      completedItems: 1,
      totalHours: 1.5,
      completionRate: 100,
    },
    Coding: {
      totalItems: 1,
      completedItems: 1,
      totalHours: 2,
      completionRate: 100,
    },
    Documentation: {
      totalItems: 1,
      completedItems: 0,
      totalHours: 1.5,
      completionRate: 0,
    },
  },
};

// Mock Service API
class MockDataService {
  constructor() {
    this.templates = [...mockTemplates];
    this.schedules = [...mockSchedules];
    this.categories = [...mockCategories];
    this.stats = { ...mockStats };
  }

  // Template methods
  async getTemplates() {
    return [...this.templates];
  }

  async getTemplateById(id) {
    const template = this.templates.find((t) => t._id === id);
    if (!template) throw new Error("Template not found");
    return { ...template };
  }

  async createTemplate(data) {
    const newTemplate = {
      _id: `template${Date.now()}`,
      ...data,
      totalHours: this.calculateTotalHours(data.items || []),
    };
    this.templates.push(newTemplate);
    return { ...newTemplate };
  }

  async updateTemplate(id, data) {
    const index = this.templates.findIndex((t) => t._id === id);
    if (index === -1) throw new Error("Template not found");

    const updatedTemplate = {
      ...this.templates[index],
      ...data,
      _id: id,
      totalHours: this.calculateTotalHours(
        data.items || this.templates[index].items
      ),
    };

    this.templates[index] = updatedTemplate;
    return { ...updatedTemplate };
  }

  async deleteTemplate(id) {
    const index = this.templates.findIndex((t) => t._id === id);
    if (index === -1) throw new Error("Template not found");
    this.templates.splice(index, 1);
    return { success: true };
  }

  // Schedule methods
  async getSchedules(filters = {}) {
    let filteredSchedules = [...this.schedules];

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      filteredSchedules = filteredSchedules.filter((s) => {
        const date = new Date(s.date);
        return date >= start && date <= end;
      });
    }

    if (filters.status) {
      filteredSchedules = filteredSchedules.filter(
        (s) => s.status === filters.status
      );
    }

    return filteredSchedules;
  }

  async getScheduleById(id) {
    const schedule = this.schedules.find((s) => s._id === id);
    if (!schedule) throw new Error("Schedule not found");
    return { ...schedule };
  }

  async createSchedule(data) {
    let items = [];

    // If using a template, copy items from template
    if (data.templateId) {
      const template = this.templates.find((t) => t._id === data.templateId);
      if (template) {
        items = template.items.map((item) => ({
          ...item,
          _id: `item${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          completed: false,
        }));
      }
    }

    const newSchedule = {
      _id: `schedule${Date.now()}`,
      ...data,
      items: data.items || items,
      status: "Planned",
      overallCompletion: 0,
      totalHours: this.calculateTotalHours(data.items || items),
    };

    this.schedules.push(newSchedule);
    return { ...newSchedule };
  }

  async updateSchedule(id, data) {
    const index = this.schedules.findIndex((s) => s._id === id);
    if (index === -1) throw new Error("Schedule not found");

    const updatedSchedule = {
      ...this.schedules[index],
      ...data,
      _id: id,
    };

    // Recalculate totalHours and completion if items are modified
    if (data.items) {
      updatedSchedule.totalHours = this.calculateTotalHours(data.items);
      updatedSchedule.overallCompletion = this.calculateCompletion(data.items);

      // Update status based on completion
      if (updatedSchedule.overallCompletion === 0) {
        updatedSchedule.status = "Planned";
      } else if (updatedSchedule.overallCompletion < 100) {
        updatedSchedule.status = "In Progress";
      } else {
        updatedSchedule.status = "Completed";
      }
    }

    this.schedules[index] = updatedSchedule;
    return { ...updatedSchedule };
  }

  async deleteSchedule(id) {
    const index = this.schedules.findIndex((s) => s._id === id);
    if (index === -1) throw new Error("Schedule not found");
    this.schedules.splice(index, 1);
    return { success: true };
  }

  // Schedule item methods
  async addScheduleItem(scheduleId, itemData) {
    const schedule = this.schedules.find((s) => s._id === scheduleId);
    if (!schedule) throw new Error("Schedule not found");

    const newItem = {
      _id: `item${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...itemData,
      completed: false,
    };

    schedule.items.push(newItem);

    // Update schedule stats
    schedule.totalHours = this.calculateTotalHours(schedule.items);
    schedule.overallCompletion = this.calculateCompletion(schedule.items);

    // Update status
    if (schedule.overallCompletion === 0) {
      schedule.status = "Planned";
    } else if (schedule.overallCompletion < 100) {
      schedule.status = "In Progress";
    } else {
      schedule.status = "Completed";
    }

    return { ...schedule };
  }

  async updateScheduleItem(scheduleId, itemId, itemData) {
    const schedule = this.schedules.find((s) => s._id === scheduleId);
    if (!schedule) throw new Error("Schedule not found");

    const itemIndex = schedule.items.findIndex((i) => i._id === itemId);
    if (itemIndex === -1) throw new Error("Item not found");

    schedule.items[itemIndex] = {
      ...schedule.items[itemIndex],
      ...itemData,
      _id: itemId,
    };

    // Update schedule stats
    schedule.totalHours = this.calculateTotalHours(schedule.items);
    schedule.overallCompletion = this.calculateCompletion(schedule.items);

    // Update status
    if (schedule.overallCompletion === 0) {
      schedule.status = "Planned";
    } else if (schedule.overallCompletion < 100) {
      schedule.status = "In Progress";
    } else {
      schedule.status = "Completed";
    }

    return { ...schedule };
  }

  async deleteScheduleItem(scheduleId, itemId) {
    const schedule = this.schedules.find((s) => s._id === scheduleId);
    if (!schedule) throw new Error("Schedule not found");

    const itemIndex = schedule.items.findIndex((i) => i._id === itemId);
    if (itemIndex === -1) throw new Error("Item not found");

    schedule.items.splice(itemIndex, 1);

    // Update schedule stats
    schedule.totalHours = this.calculateTotalHours(schedule.items);
    schedule.overallCompletion = this.calculateCompletion(schedule.items);

    // Update status
    if (schedule.overallCompletion === 0) {
      schedule.status = "Planned";
    } else if (schedule.overallCompletion < 100) {
      schedule.status = "In Progress";
    } else {
      schedule.status = "Completed";
    }

    return { ...schedule };
  }

  // Category methods
  async getCategories(type) {
    if (!type) throw new Error("Category type is required");
    return this.categories.filter((c) => c.type === type);
  }

  async addCategory(data) {
    const newCategory = {
      _id: `cat${Date.now()}`,
      ...data,
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async updateCategory(id, data) {
    const index = this.categories.findIndex((c) => c._id === id);
    if (index === -1) throw new Error("Category not found");

    const updatedCategory = {
      ...this.categories[index],
      ...data,
      _id: id,
    };

    this.categories[index] = updatedCategory;
    return { ...updatedCategory };
  }

  async deleteCategory(id) {
    const index = this.categories.findIndex((c) => c._id === id);
    if (index === -1) throw new Error("Category not found");
    this.categories.splice(index, 1);
    return { success: true };
  }

  // Stats methods
  async getStats() {
    return { ...this.stats };
  }

  // Helper methods
  calculateTotalHours(items) {
    return items.reduce((total, item) => {
      if (item.startTime && item.endTime) {
        const start = new Date(`2000-01-01T${item.startTime}`);
        const end = new Date(`2000-01-01T${item.endTime}`);
        return total + (end - start) / (1000 * 60 * 60);
      }
      return total;
    }, 0);
  }

  calculateCompletion(items) {
    if (!items.length) return 0;
    const completed = items.filter((item) => item.completed).length;
    return Math.round((completed / items.length) * 100);
  }
}

export default new MockDataService();

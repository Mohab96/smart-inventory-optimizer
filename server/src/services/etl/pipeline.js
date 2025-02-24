const cron = require("node-cron");
const winston = require("winston");

class Pipeline {
  constructor(extract, transform, load, scheduleExpression, name) {
    if (typeof extract === "function") {
      this.extract = extract;
    } else {
      throw new Error("extract must be a function");
    }

    if (typeof transform === "function") {
      this.transform = transform;
    } else {
      throw new Error("transform must be a function");
    }

    if (typeof load === "function") {
      this.load = load;
    } else {
      throw new Error("load must be a function");
    }

    this.extract = extract;
    this.transform = transform;
    this.scheduleExpression = scheduleExpression;
    this.name = name;
  }

  async doWork() {
    const rawData = await this.extract();
    const transformedData = await this.transform(rawData);
    await this.load(transformedData);
  }

  async execute() {
    try {
      // cron.schedule(this.scheduleExpression, executeWithRetry(this.doWork));
      cron.schedule(this.scheduleExpression, this.doWork);
    } catch (error) {
      winston.error(error);
    }
  }
}

module.exports = Pipeline;

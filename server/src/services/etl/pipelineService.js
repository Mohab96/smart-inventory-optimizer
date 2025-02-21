class PipelineService {
  constructor(pipelines) {
    this.pipelines = pipelines;
  }

  register(pipeline) {
    this.pipelines.push(pipeline);
  }

  async start() {
    this.pipelines.forEach(async (pipeline) => {
      await pipeline.execute();
    });
  }
}

module.exports = PipelineService;

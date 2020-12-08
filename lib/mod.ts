export class SystemStatus {
  memTotal: Number;
  memFree: Number;
  cpuCount: Number;
  cpuUsage: Number;
  status: Number;
  static get STATUS_STOPPED() {
    return 0;
  }

  static get STATUS_STARTED() {
    return 1;
  }
  constructor() {
    this.memTotal = 0;
    this.memFree = 0;
    this.cpuCount = 0;
    this.cpuUsage = 0;
    this.status = 0;
  }
  async start() {
    if (this.status === SystemStatus.STATUS_STARTED) {
      throw new Error("SystemStatus service is already started");
    }

    this.status = SystemStatus.STATUS_STARTED;

    const memInfo = Deno.run({
      cmd: ["cat", "/proc/meminfo"],
      stdout: "piped",
      stderr: "piped",
    });

    const memOutput = await memInfo.output();
    const memStr = new TextDecoder().decode(memOutput);
    let memFree = -1;
    this.memFree = -1;
    this.memTotal = -1;
    for (const line of memStr.split("\n")) {
      if (line.includes("MemTotal:")) {
        this.memTotal = Math.floor(
          Number(line.split(":")[1].slice(0, -3).trim()) / 1024,
        );
        continue;
      }
      if (/(^MemFree|^Buffers|^Cached|^SReclaimable):/.test(line)) {
        memFree += parseInt(line.split(":")[1].slice(0, -3).trim());
        continue;
      }
    }
    this.memFree = Math.ceil(memFree / 1024);
    memInfo.close();

    const cpuInfo = Deno.run({
      cmd: ["cat", "/proc/stat"],
      stdout: "piped",
      stderr: "piped",
    });

    const cpuOutput = await cpuInfo.output();
    const cpuStr = new TextDecoder().decode(cpuOutput);
    let cpuCount = -1;
    for (const line of cpuStr.split("\n")) {
      if (line.includes("cpu")) {
        cpuCount += 1;
      }
      if (cpuCount == 0) {
        const cpuStats = line.split(" ");
        const currentWorkTime = Number(cpuStats[2]) + Number(cpuStats[3]) +
          Number(cpuStats[4]);
        const total = currentWorkTime + Number(cpuStats[5]);
        this.cpuUsage = Math.ceil((currentWorkTime * 100) / total);
      }
    }
    this.cpuCount = cpuCount;
    cpuInfo.close();
    return;
  }
  getMemTotal() {
    if (this.status === SystemStatus.STATUS_STOPPED) {
      throw new Error("SystemStatus service is not started");
    }
    return this.memTotal;
  }
  getMemFree() {
    if (this.status === SystemStatus.STATUS_STOPPED) {
      throw new Error("SystemStatus service is not started");
    }
    return this.memFree;
  }
  getCpuCount() {
    if (this.status === SystemStatus.STATUS_STOPPED) {
      throw new Error("SystemStatus service is not started");
    }
    return this.cpuCount;
  }
  getCpuUsage() {
    if (this.status === SystemStatus.STATUS_STOPPED) {
      throw new Error("SystemStatus service is not started");
    }
    return this.cpuUsage;
  }
  stop() {
    if (this.status === SystemStatus.STATUS_STOPPED) {
      throw new Error("SystemStatus service is not started");
    }
    this.status = SystemStatus.STATUS_STOPPED;
    return;
  }
}

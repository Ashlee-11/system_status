import { SystemStatus } from "./test_deps.ts";
import {
  assertEquals,
  assertThrows,
} from "./test_deps.ts";

const monitor = new SystemStatus();

Deno.test("Monitor not started error check.", () => {
  assertThrows(
    () => {
      [
        monitor.getMemTotal(),
        monitor.getMemFree(),
        monitor.getCpuCount(),
        monitor.getCpuUsage(),
        monitor.stop(),
      ];
    },
    Error,
    "SystemStatus service is not started",
  );
});

Deno.test({
  name: "Cpu cores test.",
  ignore: (Deno.build.os === "windows" || Deno.build.os === "darwin"),
  async fn() {
    await monitor.start();
    const cpuCount = monitor.getCpuCount();
    assertEquals((cpuCount > 0), true, "CPU count not valid.");
    await monitor.stop();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Total & free Memory count check.",
  ignore: (Deno.build.os === "windows" || Deno.build.os === "darwin"),
  async fn() {
    await monitor.start();
    const memTotal = monitor.getMemTotal();
    const memFree = monitor.getMemFree();
    assertEquals(
      (memTotal > 0 && memFree > 0 && memTotal >= memFree),
      true,
      "Total and free memory calculation WRONG!",
    );
    await monitor.stop();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "CPU utilization check.",
  ignore: (Deno.build.os === "windows" || Deno.build.os === "darwin"),
  async fn() {
    await monitor.start();
    const cpuUsage = monitor.getCpuUsage();
    assertEquals(
      (cpuUsage >= 0 && cpuUsage <= 100),
      true,
      "Some error in showing cpu utilization.",
    );
    await monitor.stop();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

const { table } = require("table");
const os = require("os");

const watch = () => {
  const cpuLoad = os.loadavg()[0];
  const cpuCores = os.cpus().length;
  const cpuPercentage = ((cpuLoad / cpuCores) * 100).toFixed(2).concat("%");

  const totalMemory = os.totalmem();
  const usedMemory = process.memoryUsage().rss;
  const memoryPercentage = ((usedMemory / totalMemory) * 100).toFixed(2).concat("%");

  const data = [
    ["Recurso", "Uso"],
    ["CPU", cpuPercentage],
    ["Memória", memoryPercentage],
  ];
  console.log(table(data));
};

module.exports = { watch };

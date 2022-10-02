import { build } from "esbuild";
import { join, resolve } from "path";
import { execSync } from "child_process";

const start = async () => {
  const pkg = await import(join(process.cwd(), "package.json"));
  const isWatch =
    process.argv.slice(2).includes("--watch") ||
    process.argv.slice(2).includes("-w");
  const external = [...Object.keys(pkg.dependencies)];
  const isDev = process.env.NODE_ENV === "development";

  const watch = isWatch
    ? {
        onRebuild(error?: unknown) {
          if (error) console.error("Watch build failed 😡:", error);
          else {
            console.log("Watch build succeeded 👍🏻");
          }
        },
      }
    : false;

  try {
    build({
      bundle: true,
      sourcemap: isDev,
      format: "esm",
      minify: true,
      external,
      outdir: "./dist/",
      target: ["chrome58", "firefox57", "safari11"],
      define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      },
      entryPoints: [pkg.source],
      plugins: [
        {
          name: "start/end",
          setup(pluginBuild) {
            if (isWatch) {
              pluginBuild.onStart(() => {
                console.time("Esbuild Time:");
              });
              pluginBuild.onEnd(() => {
                console.timeEnd("Esbuild Time:");
              });
            }
          },
        },
      ],
      watch,
    });
    execSync("pwd && cp -r ../bin ../dist/bin", {
      stdio: [0, 1, 2],
      cwd: resolve(__dirname, "."),
    });
  } catch (error) {
    process.exit(1);
  }
};

start();

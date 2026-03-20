// frontend/src/export/pipeline/ExportEngine.js

/**
 * ExportEngine
 * ---------------------------------------------------------
 * Orchestrates the full export pipeline.
 * Steps:
 *   1. Initialize context
 *   2. Serialize project
 *   3. Assemble files
 *   4. Write bundle
 */

import ExportContext from "./ExportContext";
import ProjectSerializer from "./ProjectSerializer";
import FileAssembler from "./FileAssembler";
import BundleWriter from "./BundleWriter";

export default class ExportEngine {
  constructor({ project, screens, components, runtime }) {
    this.context = new ExportContext({
      project,
      screens,
      components,
      runtime
    });
  }

  async run() {
    const ctx = this.context;

    ctx.log("Starting export pipeline…");

    // 1. Serialize project metadata
    ctx.log("Serializing project…");
    const serialized = ProjectSerializer.serialize(ctx.project);
    ctx.setBundlePart("project.json", serialized);

    // 2. Assemble runtime + screens + components
    ctx.log("Assembling files…");
    const assembled = FileAssembler.assemble({
      screens: ctx.screens,
      components: ctx.components,
      runtime: ctx.runtime
    });
    ctx.setBundlePart("app", assembled);

    // 3. Write final bundle
    ctx.log("Writing bundle…");
    const output = await BundleWriter.write(ctx.getBundle());

    ctx.log("Export pipeline complete.");
    return output;
  }
}

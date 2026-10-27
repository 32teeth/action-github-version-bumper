const core = require("@actions/core")

const main = async () => {
  try {
    let tag = core.getInput("tag") || process.env.GITHUB_REF?.replace(/^refs\/tags\//, "")
    const onlyTagNumber = core.getInput("numbers_only") === "true"

    if (!tag) {
      throw new Error("Tag input is required")
    }

    // Remove leading 'v' if present
    if (tag.startsWith("v")) {
      tag = tag.slice(1)
    }

    const tagParts = tag.split(".")
    if (tagParts.length !== 3) {
      throw new Error("Tag must be in the format X.Y.Z")
    }

    let [major, minor, patch] = tagParts.map(Number)
    if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
      throw new Error("Tag parts must be numbers")
    }

    patch += 1
    const newTag = `${major}.${minor}.${patch}`
    const outputTag = onlyTagNumber ? newTag : `v${newTag}`

    core.setOutput("tag", outputTag)
  } catch (error) {
    core.setFailed(error.message)
    process.exit(1)
 }
}

main()
const fs = require("fs");
const path = require("path");

// Color mappings - old to new
const colorMap = {
  "#4CAF50": "AppColors.primary",
  "#E8F5E9": "AppColors.background",
  "#F5F5F5": "AppColors.background",
  "#fff": "AppColors.white",
  "#ffffff": "AppColors.white",
  "#FFFFFF": "AppColors.white",
  "#333": "AppColors.textPrimary",
  "#334155": "AppColors.textPrimary",
  "#666": "AppColors.textLight",
  "#64748b": "AppColors.textLight",
  "#999": "AppColors.textSecondary",
  "#94a3b8": "AppColors.textSecondary",
  "#DDD": "AppColors.border",
  "#E0E0E0": "AppColors.border",
  "#e2e8f0": "AppColors.border",
  "#F44336": "AppColors.error",
  "#EF4444": "AppColors.error",
};

// Import statement to add
const importStatement = 'import { AppColors } from "@/constants/theme";';

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if already has import
    if (!content.includes("import { AppColors }")) {
      // Find the last import statement
      const importRegex = /import .+ from .+;/g;
      const imports = content.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        content = content.replace(
          lastImport,
          lastImport + "\n" + importStatement
        );
      }
    }

    // Replace colors
    for (const [oldColor, newColor] of Object.entries(colorMap)) {
      const regex1 = new RegExp(`color: "${oldColor}"`, "g");
      const regex2 = new RegExp(`backgroundColor: "${oldColor}"`, "g");
      const regex3 = new RegExp(`borderColor: "${oldColor}"`, "g");
      const regex4 = new RegExp(`borderTopColor: "${oldColor}"`, "g");
      const regex5 = new RegExp(`borderLeftColor: "${oldColor}"`, "g");

      content = content.replace(regex1, `color: ${newColor}`);
      content = content.replace(regex2, `backgroundColor: ${newColor}`);
      content = content.replace(regex3, `borderColor: ${newColor}`);
      content = content.replace(regex4, `borderTopColor: ${newColor}`);
      content = content.replace(regex5, `borderLeftColor: ${newColor}`);
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✓ Updated ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
}

// Update all form sections
const formDir = path.join(__dirname, "../app/form");
if (fs.existsSync(formDir)) {
  const files = fs.readdirSync(formDir);
  files.forEach((file) => {
    if (file.endsWith(".tsx")) {
      updateFile(path.join(formDir, file));
    }
  });
}

console.log("\nColor update complete!");

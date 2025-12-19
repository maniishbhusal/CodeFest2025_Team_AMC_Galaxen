const fs = require("fs");
const path = require("path");

// Files to update (sections with navigation buttons)
const filesToUpdate = [
  "section-2.tsx",
  "section-3.tsx",
  "section-4.tsx",
  "section-5.tsx",
  "section-6.tsx",
];

function updateNavigationButtons(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Update Next button to use secondary color (pink)
    content = content.replace(
      /nextButton: \{[\s\S]*?backgroundColor: AppColors\.primary,/g,
      `nextButton: {
    flex: 1,
    backgroundColor: AppColors.secondary,`
    );

    // Keep back button with primary outline

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✓ Updated navigation buttons in ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
}

// Update form sections
const formDir = path.join(__dirname, "../app/form");
filesToUpdate.forEach((file) => {
  const filePath = path.join(formDir, file);
  if (fs.existsSync(filePath)) {
    updateNavigationButtons(filePath);
  }
});

console.log("\nNavigation button colors updated!");

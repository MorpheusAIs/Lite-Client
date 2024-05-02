                Application Development & Release Workflow Process (CI/CD)


This document describes the CI/CD development and release process for the Lite-Client component of the Morpheus Ecosystem Project. It is an evolving document as enhancements are discovered and integrated.


I. Development Cycle
  A. Branch Creation
     1. Developers update or create their branches (e.g., `DEV1`, `DEV2`, ..., `DEVX`) from the latest `INT` to incorporate recent changes.

  B. Development and Testing
     1. Development and local unit testing occur within these branches. Once a feature is complete, it's committed to the respective branch.

II. CI/CD Workflow for Integration
  A. Pull Request to INT
    1. Developers push their changes to the `DEV` branch and create a pull request (PR) to the `INT` branch. 

  B. Automated Testing and Version Increment
    1. Automated tests run against the PR.
    2. If tests pass, a minor version increment (e.g., `0.1.0` to `0.2.0`) is performed for new features or a patch version (e.g., `0.1.0` to `0.1.1`) for bug fixes, tagging the `INT` branch.

III. User Acceptance Testing (UAT)
  A. Execution of UAT on INT
     1. The `INT` branch, now with the new version tag, undergoes UAT. Fixes are made in `DEV` branches as needed and go through the cycle again until UAT is passed.

IV. Production Release
  A. Preparation for Production
     1. A PR is created from `INT` to `PROD` after successful UAT. The version tag from `INT` is proposed for the production release.

  B. Final Review, Merge, and Production Tagging
    1. The DevOps team conducts a final review. If approved, the PR is merged into `PROD`.
    2. The merge commit in `PROD` is tagged with the version number from `INT` (e.g., `1.0.0`), clearly indicating the release version.

V. Process Review and Optimization
   A. Feedback is collected from all stakeholders post-release.
   B. The process and tools are adjusted based on feedback to improve future cycles.
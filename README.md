# MyRecipe (still a working name)

A clutter-free iOS recipe manager that extracts and saves only the essentials such as the title, ingredients, and instructions directly from any recipe URL.

Online recipe sites are notoriously buried under heavy advertisements and long-winded stories before you ever reach the actual ingredients. **MyRecipe** solves that problem by scraping the core recipe data and storing it locally in a clean, distraction-free format, while doubling as a hands-on full-stack project built with **React Native, Expo, FastAPI, and PostgreSQL**.

---

## Overview

- **Current Status:** Functional on iOS for personal use, with plans to publish for free on the Apple App Store.
- **Architecture & Authentication:** Currently includes user authentication (sign-up/login) built to practice end-to-end API integration between React Native, FastAPI, and PostgreSQL.
- **Roadmap:**
  - **Local-First Storage:** Remove authentication before public release in favor of purely local device storage eliminating unnecessary friction and avoiding collecting user credentials when accounts aren't needed.
  - **Custom & Editable Recipes:** Add support for creating recipes from scratch and editing scraped recipes so users can save personal tweaks.
  - **UI & Layout Polish:** Carry the bright soft-purple and yellow color palette from the authentication screens onto the home page, add a dedicated submit button to the URL input modal, and build responsive landscape support alongside portrait mode.

# Usage
The app itself is fairly simple to use and does not have all the UI features implemented that I have planned yet but it accomplishes the goal of de-cluttering the use of online recipes without needing to print them off on paper.
### Adding a recipe
1. Open the application.
2. You will be met with the home screen and an **Add Recipe** button.
3. Press the **Add Recipe** button to open the URL input.

<kbd>
  <img width="295" height="639" alt="IMG_0669" src="https://github.com/user-attachments/assets/17f2c43c-193a-4a98-bba9-b30ccde7e6d2" />
</kbd>

Simply paste your URL and press enter to submit it.

<kbd>
  <img width="295" height="215" alt="IMG_0670" src="https://github.com/user-attachments/assets/57f55716-60c7-4674-96ec-04eb9be88506" />
</kbd>
</kbd>

Then you should see a new recipe on your home page! Click it and make your meal :)

<table>
  <tr>
    <td align="center" valign="top">
      <img width="295" height="639" alt="IMG_0671" src="https://github.com/user-attachments/assets/e1198e5f-2384-4ed6-853a-e84b1468f3e4" />
    </td>
    <td align="center" valign="top">
      <img width="295" height="639" alt="IMG_0673" src="https://github.com/user-attachments/assets/c027c911-877d-44ad-b41e-9f1881c11173" />
    </td>
  </tr>
</table>

## Tech Stack & Acknowledgments

- **Frontend:** React, React Native, Expo
- **Backend:** FastAPI, PostgreSQL
- **Recipe Parsing:** [`recipe-scrapers`](https://github.com/hhursev/recipe-scrapers) — Licensed under the MIT License, Copyright (c) 2015 The recipe-scrapers contributors.

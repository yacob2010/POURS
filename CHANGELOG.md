# Changelog

### [0.0.36] - 2026-11-22

### Added
- Sidebar with Library and Stats links, plus your email and a sign-out button
- Stats page with total wines, average rating, average price, price range, highest-rated wine, wines by type and region charts, most used descriptors, and recently added wines
- Pours is now live on GitHub Pages and updates automatically whenever changes are pushed
- The Library now holds liquor and drinks as well as wine, with a Category choice (Wine, Liquor, Drink) when adding or editing
- Brand field for liquor, so you can track which brands you've tried
- Category buttons on the Library page to filter by Wine, Liquor, or Drink

### Changed
- Dark mode now uses a deeper, richer maroon, with clearer differences between the page, sidebar, cards, and borders
- The POURS wordmark and tagline now appear only in the sidebar, not at the top of the Library page
- Stopped syncing unneeded files (`node_modules` and `.DS_Store`) to GitHub, so syncing is faster and the repo is cleaner
- Type and sub-type choices now change with the category, such as Gin with London Dry and Old Tom, or Red with Pinot Noir
- Vintage is only asked for on wine
- The type filter on the Library page only lists types you actually have in the chosen category
- Library search now also matches brand
- Library cards and the detail view show the brand, and the wording now says "collection" and "items" instead of "wines"

### Fixed
- Fixed the blank page on the live site and the missing sign-in connection after publishing
- Google Fonts now load correctly, so Playball and Nunito Sans show up as intended

## [0.0.20] - 2026-11-21

### Added
- Your wines are now saved to your account, so they're there on any device you sign in from
- Custom "Other…" types, sub-types, regions, and descriptors are saved to your account too
- Wine cards in the library showing name, type, region, rating, price, and tasting date
- An add and edit wine form with type, sub-type, region, vintage, price, tasting date, rating, descriptors, and notes
- A wine detail view with Edit and Delete, including a confirmation before removing a wine
- A library page with search, a type filter, and sorting by date added, name, rating, price, or tasting date
- Blend as its own wine type, with Red Blend, White Blend, GSM, Bordeaux Blend, Meritage, and Super Tuscan sub-types
- An arrow button to flip sorting between ascending and descending
- Pressing Escape closes any open window
- A light (off-white) theme alongside the burgundy one, with a Light/Dark button in the header that remembers your choice

### Changed
- Signing in now takes you to your wine library instead of the placeholder page

### Fixed
- Tasting dates no longer show the previous month when the date is the 1st

### Removed
- The temporary "Add test wine" button

## [0.0.6] - 2026-11-20

### Added
- A fresh Pours project built on React, Vite, and Tailwind, replacing the old Replit-based one
- The burgundy and rosé colors, with Playball for the wordmark and Nunito Sans for everything else
- A connection to Supabase so your data can live online instead of in one browser
- Email and password sign-up and sign-in, with a "stay signed in" session
- A set of ready-made buttons, inputs, dialogs, and menus to build the app screens from

### Removed
- The default Vite starter page and its leftover styles

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
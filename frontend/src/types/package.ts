/**
 * Package Builder Types
 * For building custom wedding packages
 */

/**
 * Individual package item (venue, decor, catering, etc.)
 */
export type PackageItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

/**
 * Package category
 */
export type PackageCategory = 'venue' | 'decor' | 'catering' | 'photography' | 'videography' | 'dj' | 'mehendi' | 'makeup';

/**
 * Full package selection
 */
export type PackageSelection = {
  venue?: PackageItem;
  decor?: PackageItem;
  catering?: PackageItem;
  photography?: PackageItem;
  videography?: PackageItem;
  dj?: PackageItem;
  mehendi?: PackageItem;
  makeup?: PackageItem;
};

/**
 * Package builder state
 */
export type PackageBuilderState = {
  selection: PackageSelection;
  guestCount: number;
  budget: number;
};

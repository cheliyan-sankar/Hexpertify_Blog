import fs from 'fs';
import path from 'path';

const categoriesFilePath = path.join(process.cwd(), 'content/categories.json');

export interface CategoriesData {
  categories: string[];
}

function ensureCategoriesFile() {
  const dir = path.dirname(categoriesFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(categoriesFilePath)) {
    const defaultData: CategoriesData = {
      categories: ['All', 'Mental Health', 'Fitness', 'Career', 'AI', 'Cloud', 'Technology']
    };
    fs.writeFileSync(categoriesFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

export function getAllCategories(): string[] {
  ensureCategoriesFile();
  const fileContents = fs.readFileSync(categoriesFilePath, 'utf8');
  const data: CategoriesData = JSON.parse(fileContents);
  return data.categories;
}

export function addCategory(category: string): { success: boolean; error?: string } {
  try {
    ensureCategoriesFile();
    const fileContents = fs.readFileSync(categoriesFilePath, 'utf8');
    const data: CategoriesData = JSON.parse(fileContents);

    if (data.categories.includes(category)) {
      return { success: false, error: 'Category already exists' };
    }

    data.categories.push(category);
    fs.writeFileSync(categoriesFilePath, JSON.stringify(data, null, 2), 'utf8');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function deleteCategory(category: string): { success: boolean; error?: string } {
  try {
    ensureCategoriesFile();
    const fileContents = fs.readFileSync(categoriesFilePath, 'utf8');
    const data: CategoriesData = JSON.parse(fileContents);

    if (category === 'All') {
      return { success: false, error: 'Cannot delete "All" category' };
    }

    data.categories = data.categories.filter(c => c !== category);
    fs.writeFileSync(categoriesFilePath, JSON.stringify(data, null, 2), 'utf8');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function updateCategories(categories: string[]): { success: boolean; error?: string } {
  try {
    ensureCategoriesFile();
    const data: CategoriesData = { categories };
    fs.writeFileSync(categoriesFilePath, JSON.stringify(data, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

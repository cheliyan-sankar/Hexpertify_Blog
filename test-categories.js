import { createCategory, removeCategoryAction } from './lib/actions';

async function testCategories() {
  try {
    console.log('Testing createCategory...');
    const addResult = await createCategory('Test Category');
    console.log('Add result:', addResult);

    console.log('Testing removeCategoryAction...');
    const deleteResult = await removeCategoryAction('Test Category');
    console.log('Delete result:', deleteResult);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCategories();
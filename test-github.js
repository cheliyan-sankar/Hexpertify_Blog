import { getFileContent, commitFile } from './lib/github';

async function testGitHubAPI() {
  try {
    console.log('Testing GitHub API...');

    // Test reading categories.json
    const content = await getFileContent('content/categories.json');
    console.log('Categories content:', content);

    // Test writing to categories.json
    const testData = {
      categories: ['All', 'Test Category']
    };
    await commitFile('content/categories.json', JSON.stringify(testData, null, 2), 'Test commit');
    console.log('Successfully committed test data');

    // Read back to verify
    const newContent = await getFileContent('content/categories.json');
    console.log('New categories content:', newContent);

  } catch (error) {
    console.error('GitHub API test failed:', error);
  }
}

testGitHubAPI();
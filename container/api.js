/* const API_BASE_URL = 'https://your-api-endpoint.com/api/recipes'; // 실제 API 엔드포인트를 여기에 입력하세요

// 2.1 요리 이름으로 레시피 정보 가져오기
export const fetchRecipeByName = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/by-name`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe by name:', error);
    throw error;
  }
};

// 2.2 인기 레시피 이름 반환
export const fetchPopularRecipes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/popular`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    throw error;
  }
};

// 2.3 오늘의 레시피 이름 반환
export const fetchTodayRecipes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/today`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching today\'s recipes:', error);
    throw error;
  }
};

// 2.4 냉장고 속 재료로 메뉴 추천
export const fetchRecommendedRecipes = async (deviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendation/${deviceId}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommended recipes:', error);
    throw error;
  }
}; */

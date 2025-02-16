const parseRSS = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Проверка на наличие ошибок парсинга
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('parseError');
    }

    // Проверка структуры RSS
    const channel = xmlDoc.querySelector('channel');
    if (!channel) {
      throw new Error('parseError');
    }

    const feedTitle = channel.querySelector('title')?.textContent;
    const feedDescription = channel.querySelector('description')?.textContent;
    if (!feedTitle || !feedDescription) {
      throw new Error('parseError');
    }

    const items = channel.querySelectorAll('item');
    if (items.length === 0) {
      throw new Error('parseError');
    }

    const posts = Array.from(items).map((item) => ({
      title: item.querySelector('title')?.textContent || 'Без названия',
      link: item.querySelector('link')?.textContent || '#',
      description: item.querySelector('description')?.textContent || '',
    }));

    return {
      feed: {
        title: feedTitle,
        description: feedDescription,
      },
      posts,
    };
  } catch (error) {
    console.error('Parsing error:', error);
    throw new Error('parseError');
  }
};

export default parseRSS;

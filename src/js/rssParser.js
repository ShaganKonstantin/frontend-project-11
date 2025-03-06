const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Проверка на наличие ошибок парсинга
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('parseError');
  }

  const channel = xmlDoc.querySelector('channel');

  const feedTitle = channel.querySelector('title')?.textContent;
  const feedDescription = channel.querySelector('description')?.textContent;
  if (!feedTitle || !feedDescription) {
    throw new Error('parseError');
  }

  const items = channel.querySelectorAll('item');

  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent,
  }));

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  };
};

export default parseRSS;

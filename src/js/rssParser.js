const parseRSS = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const feedTitle = xmlDoc.querySelector('channel > title').textContent;
    const feedDescription = xmlDoc.querySelector('channel > description').textContent;
    const items = xmlDoc.querySelectorAll('channel > item');

    const posts = Array.from(items).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
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

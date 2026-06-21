export function compileTemplate(htmlCode, cssCode, javascriptCode, data) {
  if (!htmlCode) return '';
  
  // Clone data to avoid mutating original
  const compiledData = JSON.parse(JSON.stringify(data || {}));
  
  // Ensure personal exists
  if (!compiledData.personal) compiledData.personal = {};
  
  // Fallback profile image
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80';
  if (!compiledData.personal.profileImage) {
    compiledData.personal.profileImage = DEFAULT_AVATAR;
  }
  
  // Fallback project image
  const DEFAULT_PROJECT_IMG = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80';
  if (Array.isArray(compiledData.projects)) {
    compiledData.projects.forEach(p => {
      if (!p.image) {
        p.image = DEFAULT_PROJECT_IMG;
      }
    });
  }

  let output = htmlCode;

  // 1. Compile loops: {{#variable}} ... {{/variable}}
  const loopRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
  output = output.replace(loopRegex, (match, key, content) => {
    const list = compiledData[key];
    if (!Array.isArray(list) || list.length === 0) {
      return '';
    }

    return list.map(item => {
      let itemHtml = content;
      if (typeof item === 'string') {
        itemHtml = itemHtml.replace(/\{\{this\}\}/g, item);
      } else if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(propKey => {
          let val = item[propKey];
          if (Array.isArray(val)) {
            val = val.join(', ');
          }
          const escapedKey = propKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const propRegex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g');
          itemHtml = itemHtml.replace(propRegex, val !== undefined && val !== null ? val : '');
        });
      }
      return itemHtml;
    }).join('');
  });

  // 2. Compile flat fields
  const flatRegex = /\{\{([\w.]+)\}\}/g;
  output = output.replace(flatRegex, (match, pathStr) => {
    const parts = pathStr.split('.');
    let current = compiledData;
    for (let i = 0; i < parts.length; i++) {
      if (current === undefined || current === null) {
        return '';
      }
      current = current[parts[i]];
    }
    return current !== undefined && current !== null ? current : '';
  });

  // Replace stylesheet reference with embedded style
  output = output.replace(
    /<link[^>]*href=["']style\.css["'][^>]*>/i,
    `<style>\n${cssCode || ''}\n</style>`
  );
  if (!output.includes('<style>') && cssCode) {
    output = output.replace('</head>', `<style>\n${cssCode}\n</style></head>`);
  }

  // Replace script reference with embedded script
  output = output.replace(
    /<script[^>]*src=["']script\.js["'][^>]*>([\s\S]*?)<\/script>/i,
    `<script>\n${javascriptCode || ''}\n</script>`
  );
  if (!output.includes('<script>') && javascriptCode) {
    output = output.replace('</body>', `<script>\n${javascriptCode}\n</script></body>`);
  }

  return output;
}

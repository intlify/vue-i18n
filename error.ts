// Typescript error when using pluralization and formatting #1574





// you can create your custom type declaration for the t function in a TypeScript declaration file in your project.
// custom-i18n.d.ts
declare module 'vue-i18n' {
  interface Composer<Messages, DateTimeFormats, NumberFormats, Legacy extends boolean = false> {
    t: (key: string, count: number, values?: Record<string, unknown>) => string;
  }
}


// Or u can use this


// Custom type definition
interface I18nTFunction {
  (key: string, count: number, values?: Record<string, unknown>): string;
}

// Use the custom type with the t function
const t: I18nTFunction = (key, count, values) => {
  // Your implementation of the t function
  // ...
}

// Now you can use t without type errors
console.log(t("contacts", 1, { count: 1 }));



// Or this
// Custom type definition
interface I18nTFunction {
  (key: string, count: number, values?: Record<string, unknown>): string;
}

// Your implementation of the t function
const t: I18nTFunction = (key, count, values) => {
  // Example implementation: You can customize this part based on your needs

  // Fetch the translation message for the key
  const translation = getTranslationByKey(key);

  // Handle pluralization based on the count
  const pluralizedMessage = count === 1 ? translation : pluralize(translation, count);

  // Replace placeholders with values
  const replacedMessage = replacePlaceholders(pluralizedMessage, values);

  return replacedMessage;
};

// Example utility functions (customize as needed)
function getTranslationByKey(key: string): string {
  // Fetch the translation from your data source (e.g., messages.json)
  return messages[key] || key;
}

function pluralize(message: string, count: number): string {
  // Implement your pluralization logic here (e.g., add 's' for count > 1)
  return count === 1 ? message : message + 's';
}

function replacePlaceholders(message: string, values?: Record<string, unknown>): string {
  if (values) {
    // Replace placeholders in the message with corresponding values
    for (const key of Object.keys(values)) {
      message = message.replace(`{${key}}`, String(values[key]));
    }
  }
  return message;
}

// Usage example
console.log(t("contacts", 1, { count: 1 }));

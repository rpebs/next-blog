export const validatePostData = (title, content, file, isEditing = false) => {
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.title = 'Title is required and must be a non-empty string.';
  }

  if (!content || typeof content !== 'string' || content.trim() === '') {
    errors.content = 'Content is required and must be a non-empty string.';
  }

  if (!isEditing && !file) {
    errors.file = 'Image is required.';
  }

  return errors;
};

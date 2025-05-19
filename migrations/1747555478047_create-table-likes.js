exports.up = (pgm) => {
  pgm.createTable('likes', {
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    commentId: {
      type: 'VARCHAR(50)',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};

export const nestedFilterMethod = (filter, rows) => {
  if (rows._subRows) {
    const subrows = rows._subRows.filter(row =>
      String(row[filter.id]).startsWith(filter.value),
    );
    return { ...rows, _subRows: subrows };
  }
  return String(rows[filter.id]).startsWith(filter.value) ? rows : undefined;
};

export default {
  nestedFilterMethod,
};

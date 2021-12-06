exports.paginate = (result) => {
  return (req, res, next) => {
    const p = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (p - 1) * limit;
    const endIndex = p * limit;

    const results = { total_count: result.length };

    if (endIndex < result.length) {
      results.next = {
        page: p + 1,
        limit: limit,
      };
    } else if (startIndex > 0) {
      results.previous = {
        page: p - 1,
        limit: limit,
      };
    }

    res.paginatedResults = results;
    next();
  };
};

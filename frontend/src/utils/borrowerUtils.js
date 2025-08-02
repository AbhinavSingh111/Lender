export const filterOutstandingBorrowers = (borrowers) =>
  borrowers.filter(b => b.outstanding > 0)
  .sort((a, b) => b.outstanding - a.outstanding);

export const filterFullyPaidBorrowers = (borrowers) =>
  borrowers.filter(b => b.fully_paid);

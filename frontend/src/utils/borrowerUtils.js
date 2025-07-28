export const filterOutstandingBorrowers = (borrowers) =>
  borrowers.filter(b => b.outstanding > 0);

export const filterFullyPaidBorrowers = (borrowers) =>
  borrowers.filter(b => b.fully_paid);

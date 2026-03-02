import type { PaxData, RPGClass } from '../types';

/**
 * Calculates tactical metrics for a PAX based on mission history.
 * Fitness: Total volume (posts)
 * Fellowship: Consistency percentage
 * Impact: Community leadership (awards/milestones)
 */
export const calculateRPGStats = (pax: PaxData) => {
  const fitness = Math.min(100, (pax.posts / 100) * 100);
  const fellowship = pax.consistency;
  const impact = Math.min(100, (pax.awards.length / 10) * 100);

  let pClass: RPGClass = 'Warrior';
  if (pax.posts >= 100) pClass = 'Legend';
  else if (pax.posts >= 50) pClass = 'Commander';
  else if (pax.posts >= 25) pClass = 'Guardian';

  return {
    fitness,
    fellowship,
    impact,
    class: pClass
  };
};
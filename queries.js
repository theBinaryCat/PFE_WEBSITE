//dashboard: chiffre d'affaire
const queryCA1 = `
    SELECT d.annee, SUM(CA) 
    FROM FAIT_PRODUCTION f, DIM_DATE d
    WHERE f.date_key = d.date_key
    GROUP BY d.annee
    ORDER BY d.annee
`;

const queryCA2 = `
    SELECT CAT.libebran, SUM(CA)
    FROM FAIT_PRODUCTION prod, DIM_CATEGORIE cat
    WHERE cat.categorie_key = prod.categorie_key
    GROUP BY cat.libebran
    ORDER BY cat.libebran
`;

/* const queryCA3 = `SELECT d.mois, SUM(CA) 
FROM DATAWH.FAIT_PRODUCTION f, DATAWH.DIM_DATE d
WHERE f.date_key = d.date_key
AND d.annee = 2017
GROUP BY d.mois
ORDER BY d.mois` */

const queryCA3 = `SELECT d.mois, SUM(CA) 
FROM NODE.FAIT_PRODUCTION f, NODE.DIM_DATE d
WHERE f.date_key = d.date_key
AND d.annee = 2017
GROUP BY d.mois
ORDER BY d.mois`;

module.exports = { queryCA1, queryCA2, queryCA3 };

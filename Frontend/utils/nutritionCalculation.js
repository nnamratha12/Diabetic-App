export const calculateCarbs = items => {
    let totalCarbs = 0;
    if (items.length > 0) {
        items.map(x => {
            let carbs = x.foodNutrients.find(y => parseInt(y.number) === 205);
            let itemCarbs = carbs.amount * x.count;
            totalCarbs = totalCarbs + itemCarbs;
        });
    }
    return totalCarbs;
};

export const getInsulinDose = (totalCarbs, ratio) => {
    const dose = totalCarbs / ratio;
    return Math.round(dose * 2) / 2;
};

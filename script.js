const baseDateInput = document.getElementById("baseDate");
const businessDaysInput = document.getElementById("businessDays");
const calculateButton = document.getElementById("calculateButton");
const result = document.getElementById("result");

calculateButton.addEventListener("click", async function () {
    const baseDate = baseDateInput.value;
    const businessDays = Number(businessDaysInput.value);
    const selectedDirection = document.querySelector(
        'input[name="direction"]:checked'
    );

    if (baseDate === "") {
        result.textContent = "基準日を入力してください";
        return;
    }
    
    if (businessDays < 1) {
        result.textContent = "営業日数を入力してください";
        return;
    }

    if (selectedDirection === null) {
        result.textContent = "前か後を選択してください";
        return;
    }

    const response = await fetch(
        "https://holidays-jp.github.io/api/v1/date.json"
    );
    const holidays = await response.json();

    const direction = selectedDirection.value;


    const calculatedDate = new Date(baseDate + "T00:00:00");

    let step = 1;

    if (direction === "before") {
        step = -1;
    }

    let countedBusinessDays = 0;

    while (countedBusinessDays < businessDays) {
        calculatedDate.setDate(calculatedDate.getDate() + step);
    
        const dayOfWeek = calculatedDate.getDay();
    
        const year = calculatedDate.getFullYear();
        const month = String(calculatedDate.getMonth() + 1).padStart(2, "0");
        const day = String(calculatedDate.getDate()).padStart(2, "0");
        const dateKey = `${year}-${month}-${day}`;
    
        const holidayName = holidays[dateKey];
    
        if (
            dayOfWeek !== 0 &&
            dayOfWeek !== 6 &&
            holidayName === undefined
        ) {
            countedBusinessDays++;
        }
    }

    result.textContent = calculatedDate.toLocaleDateString("ja-JP");
});
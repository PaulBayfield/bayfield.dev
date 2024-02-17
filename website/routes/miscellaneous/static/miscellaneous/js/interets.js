function addRow(form) {
    if (form.elements["date"].value === "" || form.elements["operation"].value === "" || form.elements["montant"].value === "" || form.elements["montant"].value <= 0) {
        return false;
    }

    let table = document.getElementById("table");
    let newRowDate = new Date(form.elements["date"].value);

    let insertIndex = -1;
    for (let i = 1; i < table.rows.length; i++) {
        let rowDate = new Date(table.rows[i].cells[0].innerHTML.split('/').reverse().join('-'));
        if (newRowDate < rowDate) {
            insertIndex = i;
            break;
        }
    }

    let row = table.insertRow(insertIndex);

    if (form.elements["operation"].value === "Dépot") {
        row.className = "lightgreen";
    } else {
        row.className = "lightred";
    }

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    cell1.innerHTML = form.elements["date"].value.split('-').reverse().join('/');
    cell2.innerHTML = form.elements["operation"].value;
    cell3.innerHTML = form.elements["montant"].value + " €";

    let tr = table.querySelectorAll('tr');
    let taux = 0;
    for (let i = 1; i < tr.length - 1; i++) {
        taux = tr[i].querySelectorAll('input')[0].value;
    }

    cell4.innerHTML = '<input value="' + taux + '" type="number" name="taux" placeholder="Taux" required min="0" step="0.01"> %';

    return false;
}

function calculerBenefices() {
    const tr = table.querySelectorAll('tr');

    const firstDay = new Date(new Date().getFullYear(), 0, 1);
    const lastDay = new Date(new Date().getFullYear(), 11, 31);

    let solde = 0;
    let operation = "Dépot";
    let operationAmount = 0;
    let taux = 0;
    let date = new Date(new Date().getFullYear(), 0, 1);
    let historique = 0;
    let quizaine = 0;
    let benefice = 0;

    for (let i = 1; i < tr.length + 1; i++) {
        if (i === 1) {
            solde = tr[i].querySelectorAll('td')[2].innerHTML.split(" ")[0];
            taux = tr[i].querySelectorAll('input')[0].value;
        } else {
            if (i === tr.length) {
                if (operation === "Retrait") {
                    solde = parseInt(solde) - parseInt(operationAmount);
                } else {
                    solde = parseInt(solde) + parseInt(operationAmount);
                }
                quizaine = getQuinzaineDepot(date, lastDay);
            } else {
                date = new Date(tr[i].querySelectorAll('td')[0].innerHTML.split('/').reverse().join('-'));

                if (operation === "Retrait") {
                    solde = parseInt(solde) - parseInt(operationAmount);
                    quizaine = getQuinzaineRetrait(firstDay, date);
                } else {
                    solde = parseInt(solde) + parseInt(operationAmount);
                    quizaine = getQuinzaineDepot(firstDay, date);
                }

                quizaine -= historique;
                historique += quizaine;
            }

            benefice += (solde * (quizaine * 15) * taux) / 36000;

            console.log("Operation: " + operation + " (" + operationAmount + " €)");
            console.log("Solde: " + solde);
            console.log("Taux: " + taux);
            console.log("Quizaine: " + quizaine + " (" + quizaine * 15 + " jours)");
            console.log("Benefice: " + (solde * (quizaine * 15) * taux) / 36000);
            console.log("----------------------------------");

            if (i < tr.length) {
                operation = tr[i].querySelectorAll('td')[1].innerHTML;
                operationAmount = tr[i].querySelectorAll('td')[2].innerHTML.split(" ")[0];
                taux = tr[i].querySelectorAll('input')[0].value;
            }
        }
    }
    

    console.log("Solde final: " + (parseInt(solde) + parseInt(benefice)) + " €");
    console.log("Benefice: " + benefice + " €");
    console.log("----------------------------------");

    const soldeFinal = document.getElementById("soldeFinal");
    const benefices = document.getElementById("benefices");

    soldeFinal.innerHTML = parseInt(solde) + parseInt(benefice) + " €";
    benefices.innerHTML = benefice.toFixed(3) + " €";
}

function getQuinzaineRetrait(startDate, endDate) {
    return Math.floor(((endDate - startDate) / (24 * 60 * 60 * 1000)) / 15) + 1;
}

function getQuinzaineDepot(startDate, endDate) {
    return Math.floor(((endDate - startDate) / (24 * 60 * 60 * 1000)) / 15);
}

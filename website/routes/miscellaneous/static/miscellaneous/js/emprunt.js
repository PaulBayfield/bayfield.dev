function calcul(form) {
    // Suppression des lignes sauf la première et la dernière
    let rowCount = table.rows.length;
    for (let i = rowCount - 2; i > 0; i--) {
        table.deleteRow(i);
    }


    // Cases de la dernière ligne
    let row = table.getElementsByTagName('tfoot')[0].rows[0];
    let cell3 = row.cells[2];
    let cell4 = row.cells[3];
    let cell5 = row.cells[4];


    // Modification de la dernière ligne
    cell3.innerHTML = "0";
    cell4.innerHTML = "0";
    cell5.innerHTML = "0";


    // Vérification des champs
    if (form.elements["type"].value === undefined || form.elements["type"].value === "") {
        alert("Le type est obligatoire");
        return false;
    }
    if (form.elements["montant"].value === undefined || form.elements["montant"].value === "") {
        alert("Le montant est obligatoire");
        return false;
    }
    if (form.elements["taux"].value === undefined || form.elements["taux"].value === "") {
        alert("Le taux est obligatoire");
        return false;
    }
    if (form.elements["duree"].value === undefined || form.elements["duree"].value === "") {
        alert("La durée est obligatoire");
        return false;
    }
    if (form.elements["periodicite"].value === undefined || form.elements["periodicite"].value === "") {
        alert("La périodicité des remboursements est obligatoire");
        return false;
    }


    let montant = parseFloat(form.elements["montant"].value);
    let type = form.elements["type"].value;
    

    let duree = parseInt(form.elements["duree"].value);
    let taux = parseFloat(form.elements["taux"].value) / 100;

    if (form.elements["periodicite"].value === "1") {
        taux = (1+taux)**(1/12) - 1;
        duree = duree * 12;
    } else if (form.elements["periodicite"].value === "2") {
        taux = (1+taux)**(1/4) - 1;
        duree = duree * 4;
    } else if (form.elements["periodicite"].value === "3") {
        taux = (1+taux)**(1/2) - 1;
        duree = duree * 2;
    }


    console.log('');
    console.log('--------------------');
    console.log('Montant : ' + montant);
    console.log('Taux : ' + taux);
    console.log('Durée : ' + duree);
    console.log('Périodicité : ' + form.elements["periodicite"].value);
    console.log('Type : ' + form.elements["type"].value);


    let debut = parseFloat(form.elements["montant"].value);
    let interets = 0;
    let ammortissement = 0;
    let annuite = 0;
    let fin = 0;

    let total_interets = 0;
    let total_ammortissement = 0;
    let total_annuite = 0;

    for (let i = 1; i < duree + 1; i++) {
        let row = table.getElementsByTagName('tbody')[0].insertRow(i - 1);

        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);

        interets = debut * taux;
        if (type === "1") {
            ammortissement = montant / duree;
            annuite = interets + ammortissement;
        } else {
            annuite = montant * (taux / (1 - (1 + taux) ** -duree));
            ammortissement = annuite - interets;
        }
        fin = debut - ammortissement;

        cell1.innerHTML = i;
        cell2.innerHTML = (Math.round(debut * 100) / 100).toLocaleString('fr-FR');
        cell3.innerHTML = (Math.round(interets * 100) / 100).toLocaleString('fr-FR');
        cell4.innerHTML = (Math.round(ammortissement * 100) / 100).toLocaleString('fr-FR');
        cell5.innerHTML = (Math.round(annuite * 100) / 100).toLocaleString('fr-FR');

        if (i === duree) {
            cell6.innerHTML = "0";
        } else {
            cell6.innerHTML = (Math.round(fin * 100) / 100).toLocaleString('fr-FR');
        }

        debut = fin;

        total_interets += interets;
        total_ammortissement += ammortissement;
        total_annuite += annuite;

        console.log("--------------------");
        console.log("Début : " + debut);
        console.log("Interets : " + interets);
        console.log("Ammortissement : " + ammortissement);
        console.log("Annuite : " + annuite);
        console.log("Fin : " + fin)
    }


    console.log("--------------------");
    console.log("Total Interets : " + total_interets);
    console.log("Total Ammortissement : " + total_ammortissement);
    console.log("Total Annuite : " + total_annuite)


    // Modification de la dernière ligne
    cell3.innerHTML = Math.round(total_interets).toLocaleString('fr-FR');
    cell4.innerHTML = Math.round(total_ammortissement).toLocaleString('fr-FR');
    cell5.innerHTML = Math.round(total_annuite).toLocaleString('fr-FR');

    return false;
}

import { LightningElement,api, wire, track } from 'lwc';
import parseJSONResponse from '@salesforce/apex/JSONParserUtil.parseJSONResponse';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Creditor Name', fieldName: 'creditorName', editable: true },
    { label: 'First Name', fieldName: 'firstName', editable: true },
    { label: 'Last Name', fieldName: 'lastName', editable: true },
    { label: 'Min Payment Percentage', fieldName: 'minPaymentPercentage', type: 'decimal', editable: true },
    { label: 'Balance', fieldName: 'balance', type: 'currency', editable: true },
];

export default class StrategicFinancialSolutions extends LightningElement {
    @track data;
    @track error;
    @track getData = [];
    @api count;
    @track selectedRows = [];
    @track totalBalance = 0;
    fldsItemValues = [];
    @api checkedRow;
    columns = columns;
    @wire(parseJSONResponse)
    wiredContacts({error, data}){
        if(data){
            this.data = data;
            console.log('---------data-----------'+data);
            this.getData = JSON.parse(data);
            var balance = 0;
            for(var i = 0; i < this.getData.length; i++){
                balance = balance+this.getData[i].balance;
            }
            this.totalBalance = balance;
            this.count = this.getData.length;
            this.error = undefined;
        }
        else if(error){
            this.error = JSON.stringify(error);
            console.log('---------error-----------'+error);
            this.data = undefined;
        }
    }
    addRow(){
        var lastId = this.getData[this.getData.length - 1].id;
        var obj = {
            creditorName: "",
            firstName: "",
            lastName: "",
            minPaymentPercentage: "",
            balance: "",
            id: lastId + 1
         };
        this.getData = [...this.getData,obj];
    }
    
    // Getting selected rows 
    selectedRecords(event) {
        // getting selected rows
        const selectedRows = event.detail.selectedRows;
        // this set elements the duplicates if any
        this.checkedRow = event.detail.selectedRows.length;
        let conIds = new Set();

        // getting selected record id
        for (let i = 0; i < selectedRows.length; i++) {
            conIds.add(selectedRows[i].id);
        }

        // coverting to array
        this.selectedRows = Array.from(conIds);
        console.log('-----this.selectedRows -------'+this.selectedRows);
    }
    removeClick(){
        var allData = this.getData;
        var newData = [];
        for (let index = 0; index < allData.length; index++) {
            const element = allData[index];
           if(this.selectedRows.indexOf(element.id) == -1){
                newData.push(element);
           } 
        }
        this.getData = newData;
        this.count = this.getData.length;
        var balance = 0;
        for(var i = 0; i < this.getData.length; i++){
            balance = balance+this.getData[i].balance;
        }
        this.totalBalance = balance;
    }
    save(event){
        this.count = this.getData.length;
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        console.log('--inputsItems--'+JSON.stringify(inputsItems));

        var balance = 0;
        var newData = [];
        var icount = 0;
        for(var i = 0; i < (this.count-1); i++){
            balance =parseInt(balance)+parseInt(this.getData[i].balance);
            newData.push(this.getData[i]);
            icount++;
        }
        console.log('-----icount------------'+icount);
        console.log('-----balance------------'+balance);
        for(var j=0;j<inputsItems.length;j++){
            balance = parseInt(balance)+parseInt(inputsItems[j].fields.balance);
            newData.push(inputsItems[j].fields);
        }
        console.log('-----balance------------'+balance);
        this.totalBalance = balance;
        this.getData = newData;
        console.log('--newData--'+JSON.stringify(newData));
        this.fldsItemValues = [];
        
    }
    async refresh() {
        await refreshApex(this.getData);
    }

}
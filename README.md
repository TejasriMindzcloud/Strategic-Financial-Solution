# Strategic-Financial-Solution
<template>
    <lightning-card title="Data" >
        <lightning-datatable
        key-field="id"
        data={getData}
        columns={columns}
        draft-values={fldsItemValues}
        onrowselection={selectedRecords}
        onsave={save}>
</lightning-datatable>
{error}
<lightning-button variant="brand" label="Add Debt" onclick={addRow} class="slds-m-left_x-small"></lightning-button>
<lightning-button variant="brand" label="Remove Debt" onclick={removeClick} class="slds-m-left_x-small"></lightning-button>
<div class="slds-grid slds-m-horizontal_small slds-theme_inverse totalClass">
    <div>
        <span>Total</span>
      </div>
      <div class="slds-col_bump-left">{totalBalance}</div>
</div>
<div class="slds-grid slds-m-horizontal_small">
    <div class="slds-col">
        Total Row Count : {count}
        </div>
        <div class="slds-col">
            Checked Row Count : {checkedRow}
            </div>
</div>

 </lightning-card>
 
</template>

export class DMEItem{
  constructor(category, subcategory1 , subcategory2, item, description, brand, image, indications, clinical_actions, workflow_actions) {
    this.category = category;
    this.subcategory1 = subcategory1;
    this.subcategory2 = subcategory2;
    this.item = item;
    this.description = description;
    this.brand = brand;
    this.image = image;
    this.indications = indications;
    this.clinical_actions = clinical_actions;
    this.workflow_actions = workflow_actions;
  }
}


export class Patient {
    constructor(name, dob, cdcr, dme, dpp, accommodations, f7536, f1845, f7410) {
        this.name = name;
        this.dob = dob;
        this.cdcr = cdcr;
        this.dme = dme;
        this.dpp = dpp;
        this.accommodations = accommodations;
        this.f7536 = f7536;
        this.f1845 = f1845;
        this.f7410 = f7410;
    }
}




export class PatientDme {
  constructor(dme, valid_7536, valid_dpp) {
    this.dme = dme;
    this.valid_7536 = valid_7536;
    this.valid_dpp = valid_dpp;
  }
}

export class F7536 {
  constructor(date, dme,  quantity, expiration_date, make, comments) {
    this.date = date;
    this.dme = dme;
    this.quantity = quantity;
    this.expiration_date = expiration_date;
    this.make = make;
    this.comments = comments;
  } 
}

export class F1845 {
  constructor(date, dpp) {  
    this.date = date;
    this.dpp = dpp;
  }
}

export class F7410 {   
  constructor(date, perm_temp, expiration_date, accommodations) {
        this.date = date;
        this.perm_temp = perm_temp;
        this.expiration_date = expiration_date;
        this.accommodations = accommodations;
  }
}

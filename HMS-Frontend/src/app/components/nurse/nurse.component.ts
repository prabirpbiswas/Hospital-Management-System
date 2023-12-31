import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NurseServiceService } from 'src/app/service/Nurse/nurse-service.service';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent implements OnInit {
  nurseForm: any = new FormGroup({
    name: new FormControl(''),
    position: new FormControl(""),
    registered: new FormControl(""),
    ssn: new FormControl(),
  });

  isUpdate: boolean = false;

  isInputDisabledRegistered: boolean = true;
  isInputDisabledSSN: boolean = true;
  isRegisterEnable: boolean = false;
  isSSNEnable: boolean = false;

  constructor(public nurseService: NurseServiceService, private router: ActivatedRoute, private route: Router) {
  }
  ngOnInit(): void {
    const entityId = this.router.snapshot.params['id'];
    if (entityId) {
      this.isUpdate = true;
      this.nurseService.getByID(this.router.snapshot.params['id']).subscribe((result: any) => {
        this.nurseForm = new FormGroup({
          name: new FormControl({ value: result['name'], disabled: true }),
          position: new FormControl({ value: result['position'], disabled: true }),
          registered: new FormControl({ value: result['registered'], disabled: true }),
          ssn: new FormControl({ value: result['ssn'], disabled: true })
        })
      })
    } else {
      this.isUpdate = false;
    }

  }

  submit = (data: any) => {
    if (data.valid) {
      if (this.isUpdate) {
        if (this.isRegisterEnable) {
          this.enableAll();
          this.nurseService.updateRegisteredByEmpId(this.router.snapshot.params['id'], this.nurseForm.value)
            .subscribe((result) => {
              alert("Registered Updated!")
              this.route.navigate(["/NurseList"])
            })
        }
        if (this.isSSNEnable) {
          this.enableAll();
          this.nurseService.UpdateSsnByEmpid(this.router.snapshot.params['id'], this.nurseForm.value)
            .subscribe((result: any) => {
              alert("SSN Updated!")
              this.route.navigate(["/NurseList"])
            })
        }
      } else {
        this.nurseService.save(data.value).subscribe((response: any) => alert(response.response));
        this.route.navigate(["/NurseList"])
      }
    }
    else {
      alert("All Data is Required")
    }
  };

  enableRegistered() {
    this.nurseForm.get('registered').enable();
    this.isInputDisabledSSN = false;
    this.isRegisterEnable = true;
  }

  enableSSN() {
    this.nurseForm.get('ssn').enable();
    this.isInputDisabledRegistered = false;
    this.isSSNEnable = true;
  }


  enableAll(){
    this.nurseForm.get('ssn').enable();
    this.nurseForm.get('name').enable();
    this.nurseForm.get('registered').enable();
    this.nurseForm.get('position').enable();
  }
}

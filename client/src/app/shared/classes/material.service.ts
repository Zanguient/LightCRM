import { ElementRef } from "@angular/core";
import {MaterialDatepicker} from "../interfaces";

declare var M;

export interface MaterialInstance {
  open?(): void
  close?(): void
  destroy?(): void
}

export class MaterialService {
    static toast(message: string) {
      M.toast({html: message});
    }

    static initializeFloatingButton(ref: ElementRef) {
      M.FloatingActionButton.init(ref.nativeElement);
    }

    static updateTextInputs() {
      M.updateTextFields();
    }

    static initModal(ref: ElementRef): MaterialInstance {
      return M.Modal.init(ref.nativeElement);
    }

    static initTooltip(ref: ElementRef): MaterialInstance {
      return M.Tooltip.init(ref.nativeElement);
    }

    static initDatepicker(ref: ElementRef, onClose: void): MaterialDatepicker {
      return M.Datepicker.init(ref.nativeElement, {
        format: 'yyyy-mmm-dd',
        showClearButton: true,
        onClose: onClose
      });
    }

    static initTapTarget(ref: ElementRef): MaterialInstance {
      return M.TapTarget.init(ref.nativeElement);
    }
}

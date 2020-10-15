import { ServiceFireService } from './service-fire.service';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormControl, Validators } from '@angular/forms';
import { generate } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {
  intevalo = null;
  intervalo = null;
  numero = 0;
  contador = 0;
  estadoMaquina = false;
  private temperatura = 0;
  private encendiendo = true;
  result: any;
  private datos: Array<any> = Array<any>();
  private segundos = 0;
  private registroTemperatura: Array<any> = Array<any>();
  private contadorTemperatura = 0;
  mostrarGrafica = true;
  private constanteK = 5;
  private errorT = 0;
  pausado = false;
  private contadorPer = 0;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Grafica',borderColor:['rgb(#ffffff)']},
    { data: [], label: 'Regerencia',borderColor:['rgb(#000033)'], pointBorderColor : ['rgb(#000033)']}

  ];

  constructor(private fireStorm: ServiceFireService){}

  ngOnInit(): void {
  }

   // tslint:disable-next-line: member-ordering
  mayor = new FormControl([

  ]);

    // tslint:disable-next-line: member-ordering
  resultado = new FormControl([

  ]);

    // tslint:disable-next-line: member-ordering
  voltaje = new FormControl({

  });

    // tslint:disable-next-line: member-ordering
  periodoMuestreo = new FormControl([

  ]);

  tempAmbiente = new FormControl({

  })

  perturbacion = new FormControl({

  })

  // tslint:disable-next-line: typedef
  encender() {
    if (this.mayor.value <= 0 || this.mayor.value > 100) {
      Swal.fire({
        icon: 'error',
        text: 'Error. los intervalos deben de estar entre 1 y 100',
      });
    } else if (this.mayor.value === 100) {
        Swal.fire({
          icon: 'error',
          text: 'ERROR. El intervalo debe ser menor',
        });
      } else{
        if (this.estadoMaquina === false) {
          this.intevalo = setInterval(() => {
            this.temperatura = this.numeroAletorio();
            this.numero = this.numero + this.voltaje.value * this.periodoMuestreo.value + this.temperatura;

            const temporal = {
              segundo: this.segundos,
              temperatura: this.numero
            };

            this.datos.push(temporal);
            this.barChartData[0].data.push(this.numero);
            this.resultado.setValue(this.numero);
            this.contador++;

            this.segundos += this.periodoMuestreo.value;
            this.barChartLabels.push(this.segundos + ' seg');

            if (this.contador === 1000) {
              clearInterval(this.intevalo);
              Swal.fire({
                icon: 'success',
                title: 'Proceso finalizado'
              });
              clearInterval(this.intevalo);
              this.fireStorm.createData(this.datos);
              this.contador = 0;
            }
          }, this.periodoMuestreo.value * 1000);
          this.estadoMaquina = true;
      } else if (this.estadoMaquina === true) {
        clearInterval(this.intevalo);
        this.estadoMaquina = false;
      }
    }
}

// tslint:disable-next-line: typedef
encenderV2() {
  if (this.mayor.value <= 0 /*|| this.mayor.value > 100*/) {
    Swal.fire({
      icon: 'error',
      text: 'Error. los intervalos deben de estar entre 1 y 100',
    });
  } /*else if (this.mayor.value === 100) {
      Swal.fire({
        icon: 'error',
        text: 'ERROR. El intervalo debe ser menor',
      });
    } */else
      if (this.estadoMaquina === false){
        this.numero += this.tempAmbiente.value;
        this.intevalo = setInterval(() => {
          if (this.contadorTemperatura === 0){
            this.registroTemperatura.push(0);
            this.barChartData[1].data.push(this.mayor.value);
            this.contadorTemperatura++;
          }
          else if (this.contadorTemperatura === 1){
            this.registroTemperatura.push(0);
            this.barChartData[0].data.push(this.numero);
            this.barChartData[1].data.push(this.mayor.value);
            this.contadorTemperatura++;
          }else{
              this.numero = (((this.voltaje.value + this.perturbacion.value) * 0.0094534) + ((this.voltaje.value + this.perturbacion.value) * 0.0094028)
              + (this.registroTemperatura[this.contadorTemperatura - 1] * 1.984)
              + (this.registroTemperatura[this.contadorTemperatura - 2] * -0.9841));
              this.registroTemperatura.push(this.numero);

              this.perturbacion.setValue(0);

              this.intervalo = setInterval(() => {
                this.perturbacion.setValue(this.perVoltaje());
              }, 120000)

            const temporal = {
              segundo: this.segundos,
              temperatura: this.numero,
              referencia: this.mayor.value,
              perturbacion: this.perturbacion.value,
              ambiente: this.tempAmbiente.value
            };



            this.datos.push(temporal);
            this.barChartData[0].data.push(this.numero);
            this.barChartData[1].data.push(this.mayor.value);
            this.resultado.setValue(this.numero);
            this.contador++;
            this.contadorTemperatura++;
            this.segundos += this.periodoMuestreo.value;
            this.barChartLabels.push(this.segundos + ' seg');

            this.errorT = this.mayor.value - this.numero;

            if (this.errorT > 0) {
              this.voltaje.setValue(this.errorT * this.constanteK);
            } else {
              this.voltaje.setValue(0);
            }

            if (this.contador === 3000) {
              clearInterval(this.intevalo);
              Swal.fire({
                 icon: 'success',
                title: 'Proceso finalizado'
              });
              clearInterval(this.intevalo);
              this.fireStorm.createData(this.datos);
              this.contador = 0;
              }
          }
        }, 1);
        this.estadoMaquina = true;
      }else if (this.estadoMaquina === true) {
        clearInterval(this.intevalo);
        this.estadoMaquina = false;
      }
}
  // tslint:disable-next-line: typedef
  Apagar() {
      this.estadoMaquina = false;

      clearInterval(this.intevalo);
      Swal.fire({
        icon: 'success',
        title: 'Apagado'
      });
      clearInterval(this.intevalo);
      this.fireStorm.createData(this.datos);
      this.contador = 0;
      this.barChartData[0].data = [];
      this.barChartData[1].data = [];
      this.periodoMuestreo.setValue(' ');
      this.voltaje.setValue(' ');
      this.resultado.setValue(' ');
      this.mayor.setValue(' ');
      this.estadoMaquina = false;
      this.numero = 0;
      this.barChartLabels = [];
      this.segundos = 0;
      this.registroTemperatura = [];
      this.perturbacion.setValue(' ');
      this.tempAmbiente.setValue (' ');


  }


  // tslint:disable-next-line: typedef
  verGrafica() {
    document.getElementById('grafica').style.display = 'block';
  }

  private numeroAletorio(): number {
    return Math.floor(Math.random() * (4 - 3.5)) + 1.2;
  }

  private perTemperatura(): number {
    return 0.1 * Math.floor(Math.random() * (1 - 0) + 0);
  }

  private perVoltaje(): number {
    return 0.1 * Math.floor(Math.random() * (120- 4) + 4);
  }

}

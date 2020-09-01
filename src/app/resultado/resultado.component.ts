import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormControl, Validators } from '@angular/forms';
import { generate } from 'rxjs';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoComponent implements OnInit {


  intevalo = null;
  numero = 0;
  contador = 0;
  estadoMaquina = false;
  private temperatura = 0;
  private encendido = false;
  archivo = 'valores.txt';
  result: any;


  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[] = ['10', '20', '30', '40', '50', '60', '70', '80', '90',
      '100', '110', '120', '130', '140', '150', '160', '170', '180', '190', '200', '210',
      '220', '230', '240', '250', '260', '270', '2800', '290', '300', '310', '320', '330', '340',
      '350', '360', '370', '380', '390', '400', '410', '420', '430', '440', '450', '460', '470', '480',
      '490', '500', '510', '520', '530', '540', '550', '560', '570', '580', '590', '600', '610', '620', '630',
      '60', '650', '660', '670', '680', '690', '700'];

  public barChartType: ChartType = 'line';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Temperatura' }
  ];
  fs: any;


  ngOnInit(): void {
  }

  // tslint:disable-next-line: member-ordering
  menor = new FormControl([

  ]);

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

  // tslint:disable-next-line: typedef
  encender() {
    if (this.mayor.value <= 0 || this.mayor.value > 100) {
      window.alert('Error. los intervalos deben de estar entre 1 y 100');
    } else {
      if (this.estadoMaquina === false) {
        if (this.mayor.value === 100) {
          window.alert('ERROR. El intervalo debe ser menor');
        } else {
          this.intevalo = setInterval(() => {
            this.temperatura = this.numeroAletorio();
            this.encendido = true ;
            if (this.encendido === true){

              this.numero = this.numero + this.voltaje.value * this.periodoMuestreo.value + this.temperatura;

            }else{

              this.numero = this.numero + this.voltaje.value * this.periodoMuestreo.value;
            }
            this.barChartData[0].data.push(this.numero);
            this.resultado.setValue(this.numero);
            this.contador++;

            this.result += ' ---> ' + ' ( ' + this.contador + ' )t ' + ' - ' + ' ( ' + this.numero + ' )°C ';
            //this.fs.writeFile('archivo.txt', this.result);
            if (this.contador === 70) {
              clearInterval(this.intevalo);
              window.alert('Proceso finalizado');
              clearInterval(this.intevalo);
              this.contador = 0;
            }
          }, 1000);
        }
        this.estadoMaquina = true;
      } else if (this.estadoMaquina === true) {
        //document.write(this.result);
        this.menor.setValue(' ');
        this.mayor.setValue(' ');
        clearInterval(this.intevalo);
        this.barChartData[0].data = [];
        this.estadoMaquina = false;
      }
    }
  }

  // tslint:disable-next-line: typedef
  verGrafica() {
    document.getElementById('grafica').style.display = 'block';
  }

  private numeroAletorio(): number {
    return Math.floor(Math.random() * (4 - 0.5)) + 2;
  }
}

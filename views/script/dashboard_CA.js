// Fetch data from the server
async function fetchData() {
    try {
      const response = await fetch('/dashboard/api/data');
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  
  // Configuration options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false
  };
  
  // Create a new chart instance
  //const ca_par_annee = document.getElementById('ca_par_annee').getContext('2d');
  //const ca_par_branche = document.getElementById('ca_par_annee').getContext('2d');
  
  
  // Fetch data and create the chart
  fetchData()
    .then(data => {
         myChart1 = new Chart(ca_par_annee, {
            type: 'bar',
            data: {
              labels: data.data1.labels,
              datasets: [{
                  label: 'Chiffre d affaire par année',
                  //data: datasets.data,
                  data: data.data1.datasets[0].data,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
            }]},
            options: options
        });
        myChart2 = new Chart(ca_par_branche, {
          type: 'bar',
          data: {
          labels: data.data2.labels,
          datasets: [{
              label: 'Chiffre d affaire par branche',
              //data: datasets.data,
              data: data.data2.datasets[0].data,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]},
          options: options
      });
      myChart3 = new Chart(ca_par_mois_annee, {
        type: 'bar',
        data: {
        labels: data.data3.labels,
        datasets: [{
            label: 'Chiffre d affaire par mois pour chaque année',
            //data: datasets.data,
            data: data.data3.datasets[0].data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]},
        options: options
    });
    },
    
    )
    .catch(error => {
        console.error('Error fetching data:', error);
    });
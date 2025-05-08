#include<bits/stdc++.h>
using namespace std;
void selectionsort(int arr[],int n){
  for(int i=0;i<=n-2;i++){
    int mini=i;
    for(int j=0;j<=n-1;j++){
        if(arr[j]<arr[mini]){
            mini = j;
            
        }
        
    }
    swap(arr[mini],arr[i]);
  }
}

int main(){
    int arr[5] ={23,12,45,9,11};
    selectionsort(arr,5);
    for(int i =0;i<5;i++){
        cout<<arr[i]<<" ";
    }
    cout<<endl;

    return 0;

}

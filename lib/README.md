# system_status
A library made for deno to check system related information like- total and free memory, CPU utilisation, etc on a Linux host.
With the use of these four functions one could get the following information:
1) getMemTotal(): returns total amount of memory in megabytes on the host, returned value is an integer.
2) getMemFree(): returns amount of the free memory in megabytes, returned value is an integer.
3) getCpuCount(): returns total amount of CPU cores.
4) getCpuUsage(): returns value from 0 to 100 that indicates average CPU utilization by all cores of all processors.

To use these functions one has to start the service and the after usage the service should be stopped. Service's start() function returns a promise which should be handled.

Vagrant.configure("2") do |config|
  config.vm.synced_folder '.', '/vagrant', disabled: true

  config.vm.provider "docker" do |d|
    d.force_host_vm = true
    d.image = "jaegertracing/all-in-one:1.11"
    d.ports = [
      "5775:5775",
      "6831:6831",
      "6832:6832",
      "5778:5778",
      "16686:16686",
      "14268:14268",
      "9411:9411",
      ]
  end
end
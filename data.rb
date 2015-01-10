require 'net/http'
require 'json'

BASE_URL = "https://api.meetup.com/"
API_KEY  = ENV.fetch('MEETUP_API_KEY')

trap("SIGINT") { exit! }

def get_json_data(resource, params)
  uri = URI("#{BASE_URL}/#{resource}")
  uri.query = URI.encode_www_form(params.merge({ key: API_KEY }))
  res = Net::HTTP.get_response(uri)
  json = JSON.parse(res.body, symbolize_names: true)
  exit if json[:code] == "throttled"
  json
end

puts "Getting events"
response = get_json_data(
  '2/events',
  :group_urlname => 'chadevs',
  :status => 'past',
  :page => 100
)

events = response[:results].map { |event|
  venue = event.fetch(:venue) {
    { name: "Not available", id: -1 }
  }
  {
    id: event[:id],
    name: event[:name],
    time: event[:time],
    timezone: event[:timezone],
    description: event[:description],
    venue: {
      id: venue[:id],
      name: venue[:name]
    }
  }
}

events.map { |event|
  sleep 5
  puts "Getting RSVPs for #{event[:name]}"
  rsvps_response = get_json_data('2/rsvps', event_id: event[:id], page: 70)
  rsvps = rsvps_response[:results].map { |rsvp|
    member = rsvp.fetch(:member) {
      { name: "Not Available", id: -1 }
    }
    photo = rsvp.fetch(:member_photo) {
      { highres_link: "Not Available" }
    }
    {
      response: rsvp[:response],
      name: member[:name],
      member_id: member[:member_id],
      member_photo: photo[:highres_link]
    }
  }
  event.tap { |event| event[:rsvps] = rsvps }
}

File.open("events.json", "w") do |file|
  file.write events.to_json
end
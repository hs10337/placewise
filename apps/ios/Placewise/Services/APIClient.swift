import CoreLocation
import Foundation

enum APIClientError: LocalizedError {
    case invalidURL
    case invalidResponse
    case server(String)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "The Placewise API URL is invalid."
        case .invalidResponse:
            return "The server returned an unexpected response."
        case let .server(message):
            return message
        }
    }
}

struct APIClient {
    private let baseURL: URL
    private let session: URLSession

    init(
        baseURL: URL = URL(
            string: ProcessInfo.processInfo.environment["PLACEWISE_FUNCTIONS_URL"]
                ?? "http://127.0.0.1:54321/functions/v1"
        )!,
        session: URLSession = .shared
    ) {
        self.baseURL = baseURL
        self.session = session
    }

    func resolve(
        coordinate: CLLocationCoordinate2D,
        city: String = "san-francisco"
    ) async throws -> ResolveResponse {
        guard var components = URLComponents(
            url: baseURL.appendingPathComponent("resolve"),
            resolvingAgainstBaseURL: false
        ) else {
            throw APIClientError.invalidURL
        }

        components.queryItems = [
            URLQueryItem(name: "lat", value: String(coordinate.latitude)),
            URLQueryItem(name: "lng", value: String(coordinate.longitude)),
            URLQueryItem(name: "city", value: city),
        ]

        guard let url = components.url else {
            throw APIClientError.invalidURL
        }

        let (data, response) = try await session.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIClientError.invalidResponse
        }

        guard 200 ..< 300 ~= httpResponse.statusCode else {
            let message = String(data: data, encoding: .utf8)
                ?? "Request failed with status \(httpResponse.statusCode)."
            throw APIClientError.server(message)
        }

        return try JSONDecoder().decode(ResolveResponse.self, from: data)
    }

    func fetchPlace(id: String) async throws -> PlaceBrief {
        guard var components = URLComponents(
            url: baseURL.appendingPathComponent("place"),
            resolvingAgainstBaseURL: false
        ) else {
            throw APIClientError.invalidURL
        }

        components.queryItems = [URLQueryItem(name: "id", value: id)]

        guard let url = components.url else {
            throw APIClientError.invalidURL
        }

        let (data, response) = try await session.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIClientError.invalidResponse
        }

        guard 200 ..< 300 ~= httpResponse.statusCode else {
            let message = String(data: data, encoding: .utf8)
                ?? "Request failed with status \(httpResponse.statusCode)."
            throw APIClientError.server(message)
        }

        return try JSONDecoder().decode(PlaceBrief.self, from: data)
    }
}

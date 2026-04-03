import CoreLocation
@testable import Placewise
import XCTest

final class APIClientTests: XCTestCase {
    override func tearDown() {
        MockURLProtocol.handler = nil
        super.tearDown()
    }

    func testResolveBuildsExpectedRequestAndDecodesResponse() async throws {
        let baseURL = try XCTUnwrap(URL(string: "https://example.com/functions/v1"))
        let session = makeSession()
        let client = APIClient(baseURL: baseURL, session: session)

        MockURLProtocol.handler = { request in
            XCTAssertEqual(request.url?.path, "/functions/v1/resolve")

            let components = try XCTUnwrap(
                try URLComponents(url: XCTUnwrap(request.url), resolvingAgainstBaseURL: false)
            )

            XCTAssertEqual(
                Dictionary(uniqueKeysWithValues: (components.queryItems ?? []).map { ($0.name, $0.value) }),
                [
                    "lat": "37.7955",
                    "lng": "-122.3937",
                    "city": "san-francisco"
                ]
            )

            let body = """
            {
              "selection": {
                "lat": 37.7955,
                "lng": -122.3937
              },
              "mode": "exact_place",
              "confidence": "high",
              "distanceMeters": 12,
              "place": {
                "id": "plc_ferry_building",
                "name": "Ferry Building",
                "latitude": 37.7955,
                "longitude": -122.3937,
                "placeType": "landmark",
                "coverageType": "exact_place",
                "confidence": "high"
              }
            }
            """

            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, Data(body.utf8))
        }

        let response = try await client.resolve(
            coordinate: CLLocationCoordinate2D(latitude: 37.7955, longitude: -122.3937)
        )

        XCTAssertEqual(response.mode, "exact_place")
        XCTAssertEqual(response.place?.id, "plc_ferry_building")
        XCTAssertEqual(response.distanceMeters, 12)
    }

    func testFetchPlaceDecodesPlaceBrief() async throws {
        let baseURL = try XCTUnwrap(URL(string: "https://example.com/functions/v1"))
        let session = makeSession()
        let client = APIClient(baseURL: baseURL, session: session)

        MockURLProtocol.handler = { request in
            XCTAssertEqual(request.url?.path, "/functions/v1/place")

            let components = try XCTUnwrap(
                try URLComponents(url: XCTUnwrap(request.url), resolvingAgainstBaseURL: false)
            )
            XCTAssertEqual(components.queryItems?.first(where: { $0.name == "id" })?.value, "plc_ferry_building")

            let body = """
            {
              "id": "plc_ferry_building",
              "name": "Ferry Building",
              "hook": "A waterfront landmark that keeps reinventing itself.",
              "summary": "The Ferry Building opened in 1898 and remains a civic gateway.",
              "whyItMatters": "It reflects major shifts in transport, commerce, and waterfront planning.",
              "facts": ["Transit hub"],
              "lenses": [
                { "type": "history", "body": "A long waterfront history." }
              ],
              "sources": [
                { "labelType": "official", "title": "Port of San Francisco", "url": "https://sfport.com/" }
              ],
              "confidence": "high",
              "coverageType": "exact_place"
            }
            """

            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: nil,
                headerFields: nil
            )!
            return (response, Data(body.utf8))
        }

        let brief = try await client.fetchPlace(id: "plc_ferry_building")

        XCTAssertEqual(brief.id, "plc_ferry_building")
        XCTAssertEqual(brief.sources.first?.title, "Port of San Francisco")
        XCTAssertEqual(brief.lenses.first?.type, "history")
    }

    func testResolveSurfacesServerErrors() async throws {
        let baseURL = try XCTUnwrap(URL(string: "https://example.com/functions/v1"))
        let session = makeSession()
        let client = APIClient(baseURL: baseURL, session: session)

        MockURLProtocol.handler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 500, httpVersion: nil, headerFields: nil)!
            return (response, Data("backend failed".utf8))
        }

        do {
            _ = try await client.resolve(
                coordinate: CLLocationCoordinate2D(latitude: 37.7749, longitude: -122.4194)
            )
            XCTFail("Expected resolve to throw")
        } catch let error as APIClientError {
            XCTAssertEqual(error.localizedDescription, "backend failed")
        } catch {
            XCTFail("Unexpected error: \(error)")
        }
    }

    private func makeSession() -> URLSession {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [MockURLProtocol.self]
        return URLSession(configuration: configuration)
    }
}

private final class MockURLProtocol: URLProtocol {
    static var handler: ((URLRequest) throws -> (HTTPURLResponse, Data))?

    // URLProtocol requires class overrides here.
    // swiftlint:disable:next static_over_final_class
    override class func canInit(with _: URLRequest) -> Bool {
        true
    }

    // swiftlint:disable:next static_over_final_class
    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        request
    }

    override func startLoading() {
        guard let handler = Self.handler else {
            client?.urlProtocol(self, didFailWithError: URLError(.badServerResponse))
            return
        }

        do {
            let (response, data) = try handler(request)
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }

    override func stopLoading() {}
}

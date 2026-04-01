# API Documentation

## Endpoints

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`

#### Description:
Check the health of the API service.

#### Response:
- **200 OK**: Service is running.
- **503 Service Unavailable**: Service is not running.

### System Info
- **URL**: `/api/system/info`
- **Method**: `GET`

#### Description:
Retrieve system information about the API service.

#### Response:
- **200 OK**: Returns system info, including version, uptime, etc.


const {getDiagnostics2} = require('@vuedx/typecheck');


function encodeRdJSON(result) {
  const severityMap = {
    warning: 'WARNING',
    error: 'ERROR',
    suggestion: 'INFO',
    message: 'INFO',
  };
  return JSON.stringify({
    source: {
      name: 'VueDX typecheck',
      url: 'https://github.com/znck/vue-developer-experience/tree/master/packages/typecheck',
    },
    diagnostics: result.flatMap((sourceFile) => {
      return sourceFile.diagnostics.map((diagnostic) => {
        var _a, _b;
        return ({
          message: diagnostic.text,
          severity: severityMap[diagnostic.category],
          location: {
            path: sourceFile.fileName,
            range: {
              start: {
                line: diagnostic.start.line,
                column: diagnostic.start.offset,
              },
              end: {line: diagnostic.end.line, column: diagnostic.end.offset},
            },
          },
          code: {
            value: `${(_a = diagnostic.code) !== null && _a !== void 0 ? _a : ''}`,
          },
          relatedInformation: (_b = diagnostic.relatedInformation) === null || _b === void 0 ? void 0 : _b.map((info) => {
            var _a;
            return ({
              message: info.message,
              severity: severityMap[info.category],
              location: info.span != null
                ? {
                  path: info.span.file,
                  range: {
                    start: {
                      line: info.span.start.line,
                      column: info.span.start.offset,
                    },
                    end: {
                      line: info.span.end.line,
                      column: info.span.end.offset,
                    },
                  },
                }
                : undefined,
              code: {
                value: `${(_a = info.code) !== null && _a !== void 0 ? _a : ''}`,
              },
            });
          }),
        });
      });
    }),
  });
}

const entry = [
  'C:\\Users\\kozac\\Dev\\vite-electron-builder\\src\\main',
  'C:\\Users\\kozac\\Dev\\vite-electron-builder\\src\\preload',
  'C:\\Users\\kozac\\Dev\\vite-electron-builder\\src\\renderer',
];

Promise.all(
  entry.map(getDiagnostics2),
).then(p => p.flat())
  .then(encodeRdJSON)
  .then(console.log);

